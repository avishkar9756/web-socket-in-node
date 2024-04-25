const mongoose=require('mongoose');

const entrySchema=new mongoose.Schema({

data:{
type:Number,
required:true
}

});

const entry=mongoose.model('Schema',entrySchema);

module.exports = entry;