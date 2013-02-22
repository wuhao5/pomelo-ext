var icecream  = require('icecream');
icecream.createServer({
    debug:true,
    cluster:false
});

icecream.listen(3001);




