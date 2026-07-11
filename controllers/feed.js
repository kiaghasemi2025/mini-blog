exports.getPost = (req,res,next) => {
    res.status(200).json({
        posts:[{title:'this is title',content:'this is content'}]
    })
}

exports.creatPost = (req,res,next) => {
     const title = req.body.title;
     const content = req.body.content;

    res.status(201).json({
        message:'creat first post command in restapi',
        posts:[{id:new Date().toISOString(),title:title,content:content}]
    })

}