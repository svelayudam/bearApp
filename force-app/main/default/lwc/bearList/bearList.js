import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';
import ursusResources from '@salesforce/resourceUrl/ursus_park';
/** BearController.getAllBears() Apex method */
import getAllBears from '@salesforce/apex/BearController.getAllBears';
import searchBears from '@salesforce/apex/BearController.searchBears';
import {loadStyle} from 'lightning/platformResourceLoader';

export default class BearList extends NavigationMixin(LightningElement) {

    @track searchTerm = '';
    @track bears;
    @wire(CurrentPageReference) pageRef;
    @wire(searchBears, {searchTerm: '$searchTerm'})
    loadBears(result) {
        this.bears = result;
        if (result.data) {
            fireEvent(this.pageRef, 'bearListUpdate', result.data);
        }
    }
    
	// appResources = {
	// 	bearSilhouette: ursusResources +'/img/standing-bear-silhouette.png',
    // };

    connectedCallback() {
        loadStyle(this, ursusResources + '/style.css');
    }

    handleSearchTermChange(event) {
        // Debouncing this method: do not update the reactive property as
        // long as this function is being called within a delay of 300 ms.
        // This is to avoid a very large number of Apex method calls
        window.clearTimeout(this.delayTimeout);
        const searchTerm = event.target.value;
        this.delayTimeout = setTimeout(() => {
            this.searchTerm = searchTerm;
        }, 300);
    }

    get hasResults() {
        return (this.bears.data.length > 0);
    }

    handleBearView(event) {
        console.log('handle event');
        const bearId = event.detail;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: bearId,
                objectApiName: 'Bear__c',
                actionName: 'view'
            }
        });
    }
    
	// connectedCallback() {
	// 	this.loadBears();
    // }
    
	// loadBears() {
	// 	getAllBears()
	// 		.then(result => {
	// 			this.bears = result;
	// 		})
	// 		.catch(error => {
	// 			this.error = error;
	// 		});
	// }
}