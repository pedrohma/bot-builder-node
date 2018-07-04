module.exports = class Carrier{

    constructor(){

    }

    /**
     * Implementation required
     */
    async getShippingInfo(tracking){
        throw new Error('You have to implement the method getShippingInfo!');
    }

}