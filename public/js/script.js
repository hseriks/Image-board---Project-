// console.log("script is linked");
// this file is where all of our Vue code will exist!!

(function () {

        Vue.component("modal", { // first string argument is the component
        template: "#modal", // template is the script
        data: function () { // data is the  memory of each component. This we can track
            return {
                username: '',
                url: '',
                title: '',
                description: '',
            };
        },

        props: ["imageid"], // data can be passed to components as custom attributes. This data is referred to as props. 
       
        mounted: function () {
            var self = this;
                console.log("this.imageid: ", this.imageid);
             axios.get(`/modal/${this.imageid}`)
                .then(function ({ data }) {
                    console.log('Data: ', data);
                    self.url = data[0].url;
                    self.title = data[0].title;
                    self.description = data[0].description;
                    self.username = data[0].username;
                });
        },

        watch: {imageid: function () {
            console.log("prop got updated");
            var self = this;
            console.log("this.imageid: ", this.imageid);
                axios.get(`/modal/${this.imageid}`)
                .then(function ({ data }) {
                    console.log('Data: ', data);
                    self.url = data[0].url;
                    self.title = data[0].title;
                    self.description = data[0].description;
                    self.username = data[0].username;
                });


        }},

        methods: {
            closeModal: function () {
                this.$emit("close"); // emitting to parent that we want to close modal
            }
        }
    });

    //////////////////
    //// comment ////
    //// component//
    /////////////////

    Vue.component ("comment", {
       template: "#comment",
        data: function () {
            return {
                comments: [],
                username: '',
                comment: '' // this needs to update
            };
        },

        props: ["imageid"], 
     
        mounted: function () { // This is getting all comments that exist for a picture
            var self = this;
            console.log("this.comments: ", this.comments);
             axios.get(`/comments/${this.imageid}`)
                .then(function (response) {
                    console.log("logging response on get/comments", response);
                    console.log("logging response on get/comments", response.data);
                    self.comments = response.data;
                });
        },

        watch: {imageid: function () {
            console.log("prop got updated");
            var self = this;
            console.log("this.imageid: ", this.imageid);
             axios.get(`/comments/${this.imageid}`)
                .then(function (response) {
                    console.log("logging response on get/comments", response);
                    console.log("logging response on get/comments", response.data);
                    self.comments = response.data;
                });
        }},


        methods: {
            commentHandler: function () {
                console.log("comment handler was pressed");
                axios.post('/comment', {
                    comment: this.comment,
                    username: this.username,
                    imageid: this.imageid
                }).then(response => {
                    console.log("response after comment", response);
                    console.log('resonse after post upload', response.data[0]);
                    this.comments.push(response.data[0]); 
                    console.log("Currently in comments", this.comments);
                    this.comment = "";
                    this.username = "";
                }).catch( err => console.log('err', err));
            }, 

            ///// here I need to make the page auto upload with my new comment 

            addComment: function () {
                this.$emit("comments", this.comments); //adding info here to emmit to parent
            }


        }

    })

    new Vue({
        // el - element in our html that has access to our Vue code!
        el: "#main",
        // data - an object that we add any info to that is dynamic / we want to render onscreen
        data: {
            name: "Adobo",
            seen: true,
            // cities: [],
            images: [], 
            title: '', 
            description: '',
            username: '',
            file: null,
            selectedImage: location.hash.slice(1), // add a number??
            morebutton: true
        },

        // mounted is a lifecycle method that runs when the Vue instance renders
        mounted: function () {
            console.log("my vue instance has mounted");
            console.log("this outside axios: ", this);
            var self = this;

            axios.get("/images").then(function (response) {
                console.log("this inside axios: ", self);
                // axios will ALWAYS store the info coming from the server inside a 'data' property
                // console.log("response from /cities: ", response.data);
                console.log(response.data);
                // self.cities = response.data;
                self.images = response.data;
            }).catch(function(err) {
                console.log("err in /cities: ", err);
            }), 

            window.addEventListener('hashchange', function() {
            console.log('The hash has changed!');
            self.selectedImage = location.hash.slice(1);
            }, false);

        },  


        // methods will store ALL the functions we create!!!
        methods: {
            myFunction: function () {
                console.log("myFunction is running!!!!");
            },

            addComment: function (params) {
                this.comments = params;
            },

            closeModal: function () {
                this.selectedImage = null;
                location.hash = "";
            },

            morePictures: function () {
                var self = this;
                console.log("more pictures work");
                var picturesArr = this.images; // assign images to new variable
                var smallestId = picturesArr[picturesArr.length - 1].id // 
                console.log("bottom id: ", smallestId);
                var imagesTwo = [...this.images]; // create a copy
                axios
                    .get("/morepictures/" + smallestId)
                    .then(function (response) {
                        console.log("response data after get more pictures: ", response.data);
                        for (var i = 0; i < response.data.length; i++) {
                            if (response.data[i].id == response.data[i].lowestId) {
                                self.morebutton = false;
                            }
                        }
                        return (self.images = imagesTwo.concat(response.data));
                    })
                    .catch(function (err) {
                        console.log("error getting more images: ", err);
                    });
            },

            clickHandler: function() {
                console.log("clickhandler button activated", this);
                const fd = new FormData();
                fd.append('title', this.title);
                fd.append('description', this.description);
                fd.append('username', this.username);
                fd.append('file', this.file); // here the issue must be. Why is this not being passed to my server and multer??
                axios.post('/upload', fd).then(response => {
                    //console.log('resonse after post upload', this.images);
                    this.images.unshift(response.data);
                }).catch( err => console.log('err', err));
            },
            fileSelectHandler: function (e) {
                console.log("e:", e); // this works and checks whether an image was uploaded 
                this.file=e.target.files[0];
            }
        }
    });
})();