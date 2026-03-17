const cds = require('@sap/cds');

module.exports = cds.service.impl(async function(srv) {
    srv.on('printHelloWorld', require => {
        console.log(require.data.input);
        return `${require.data.input} World`;
    })

    srv.on('addItmes', require =>{
        let result = require.data.num1 + require.data.num2;
        console.log(require.data.num1,require.data.num2);
        return result;
    })

    srv.on('myFunction', require=>{
        let result = {};
        if(require.data.element == 1){
            result.product="MBW"
        }else result.price={
            "price":"1234",
            "model":"23fs"
        }
        return result;
    })
})