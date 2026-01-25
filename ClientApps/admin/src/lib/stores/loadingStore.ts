import {makeAutoObservable} from 'mobx';

export default class LoadingStore {
    isLoading = false;
    
    constructor() {
        makeAutoObservable(this)
    }

    isBusy() {
        this.isLoading = true;
    }

    isIdle() {
        this.isLoading = false;
    }
}