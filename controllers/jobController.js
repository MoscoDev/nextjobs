const Job = require('../models/Job');


/*
@description 	Get all available blog posts.
*/
exports.fetchAllJobs = (req, res) => {
	Job.find()
			.sort({ created_at: -1 }) 
			.then(posts => res.json(posts))
			.catch(err => console.log(err));
};


/*
@description 	Create a new blog post.
*/
exports.createJob = (req, res) => {
	const { 
		title,
		body,
	} = req.body;

	//quick validation
	if( !title || !body) {
		return res.status(400).json({ message: "The 'title' and 'body' are required." });
	}

	Job.findOne({ title })
		.then(post => {
			if(post) {
				return res.status(400).json({ 
					message: "Blog post with the same title already exists and titles must be unique."
				});
			} else {
                //create a new blog post from the model
                const newJob = new Job({
                    title,
                    body
                });

                //add new user to the db
                newJob.save()
                    .then(newPost => res.json(newPost));
			}
		});
};


/* 
@description 	Delete a single blog post with given id.
*/
exports.deleteOnePost = (req, res) => {
	const { id } = req.params;
	Job.findById(id)
		.then(post => post.remove().then(() => res.json({success: true})))
		.catch(err => res.status(404).json({success: false}));
};


/* 
@description 	Update a single blog post with given id.
*/
exports.updateOnePost = (req, res) => {
	const { id } = req.params;
	Job.findByIdAndUpdate(id, req.body, { new: true }, (err, data) => {
		if (err) {
			return res.status(404).json({success: false});
		}
		res.json(data);
	});
};
