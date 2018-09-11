let mongoose = require('mongoose'); // import module

let rewardSchema = mongoose.Schema({ // import
  type:{type:String,required:true},
  winner_name:{type: String,required:true},
  detail:{type: String,required:true}
});

let Reward = module.exports = mongoose.model('rewards',rewardSchema); // import exports ให้คนอื่นใช้ได้ด้วย
