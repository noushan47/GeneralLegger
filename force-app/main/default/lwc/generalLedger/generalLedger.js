import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class GeneralLedger extends LightningElement {

    @track formList = [
        { id: 1 }
    ];

    handleClone(event) {
        const newFormId = this.formList.length + 1;
        this.formList.push({ id: newFormId });
        event.target.blur();
    }

    handleReset(event) {
        this.formList = [ { id: 1 } ];
        const allInputFields = this.template.querySelectorAll('lightning-input-field');
        if (allInputFields) {
            allInputFields.forEach(field => {
                field.reset();
            });
        }
        event.target.blur();
    }

    handleSave(event) {
        let totalDebit = 0;
        let totalCredit = 0;

        const allFields = this.template.querySelectorAll('lightning-input-field');
        const allForms = this.template.querySelectorAll('lightning-record-edit-form');

        if (allFields) {
            allFields.forEach(field => {
                if (field.fieldName === 'Debit__c') {
                    totalDebit = totalDebit + parseInt(field.value);
                }
                if (field.fieldName === 'Credit__c') {
                    totalCredit = totalCredit + parseInt(field.value);
                }
            });
        }


        if (totalDebit != totalCredit && allForms.length > 1) {
            const evt = new ShowToastEvent({
                title: 'Cannot save because the Debits and Credits are not equal.',
                variant: 'error',
            });
            this.dispatchEvent(evt);
        } else {
            const evt = new ShowToastEvent({
                title: 'General Ledger records/entries have been created.',
                message: 'Total Records/Entries: ' + this.formList.length,
                variant: 'success',
            });
            this.dispatchEvent(evt);
            if (allForms) {
                allForms.forEach(form => {
                    form.submit();
                });
            }
            location.reload();
        }
        event.target.blur();


    }
}
