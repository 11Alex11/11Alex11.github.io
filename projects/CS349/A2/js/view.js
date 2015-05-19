'use strict';

/**
 * A function that creates and returns all of the model classes and constants.
  */
function createViewModule() {

    var LIST_VIEW = 'LIST_VIEW';
    var GRID_VIEW = 'GRID_VIEW';
    var RATING_CHANGE = 'RATING_CHANGE';

    /**
     * An object representing a DOM element that will render the given ImageModel object.
     */
    var ImageRenderer = function(imageModel) {
        // TODO
        this.model;
        this.curView;
        this._init(imageModel);
    };

    _.extend(ImageRenderer.prototype, {



        _init: function(imageModel){
            var self = this;
            this.curView=GRID_VIEW;
            this.rendererDiv = document.createElement('div');
            //this.rendererDiv.style.position="relative";
    

            this.setImageModel(imageModel,this);
        },
        /**
         * Returns an element representing the ImageModel, which can be attached to the DOM
         * to display the ImageModel.
         */
        getElement: function() {
            // TODO
            return this.rendererDiv;
        },

        /**
         * Returns the ImageModel represented by this ImageRenderer.
         */
        getImageModel: function() {
            // TODO
            return this.model;
        },

        /**
         * Sets the ImageModel represented by this ImageRenderer, changing the element and its
         * contents as necessary.
         */
        setImageModel: function(imageModel) {
            // TODO

            while(this.rendererDiv.lastChild){
                this.rendererDiv.removeChild(this.rendererDiv.lastChild);
            }

           
            var imageTemplate=document.getElementById("image-template");
            this.rendererDiv.appendChild(document.importNode(imageTemplate.content, true));

            this.model=imageModel;
            var img = this.rendererDiv.getElementsByClassName("image-render")[0];
            img.setAttribute("src", "." + imageModel.getPath());

            var borderB;
            var borderR;
            var wd;

            //if time, add variables for all the things the click changes
            var overlay = this.rendererDiv.getElementsByClassName("overlay")[0];
            img.addEventListener('click',function(){
                if(overlay.style.display!="inline"){
                    borderB=img.style.borderBottom;
                    borderR=img.style.borderRight;
                    wd = img.style.width;
                    overlay.style.display="inline";
                    img.style.position="fixed";
                    img.style.margin="5%";
                    img.style.top="0"
                    img.style.left="0";
                    img.style.right="0";
                    img.style.width="90vw";
                    img.style.maxHeight="80vh";
                    img.style.zIndex="1";
                    img.style.borderBottom="none";
                    img.style.borderRight="none";
                }
                
            });
            overlay.addEventListener('click',function(){
                
                overlay.style.display="none";
                img.style.position="static";
                img.style.margin="0";
                img.style.top="auto"
                img.style.left="auto";
                img.style.right="auto";
                img.style.width=wd;
                img.style.maxHeight="none";
                img.style.zIndex="0";
                img.style.borderBottom=borderB;
                img.style.borderRight=borderR;
                
            });

            var imgName=this.rendererDiv.getElementsByClassName("image-name")[0];
            var name=imageModel.getPath();
            imgName.innerHTML=imageModel.getPath().replace('/images/',"");

            var imgCaption=this.rendererDiv.getElementsByClassName("image-caption")[0];
            imgCaption.innerHTML=imageModel.getCaption();

             var imgTime=this.rendererDiv.getElementsByClassName("image-time")[0];
             var iTime = imageModel.getModificationDate(); 
            imgTime.innerHTML= iTime.getDate() + "/" + (iTime.getMonth()+1) + "/" + iTime.getFullYear();


            var ratingButton=[];
            for(var i=0;i<5;i++){
                ratingButton[i]=this.rendererDiv.getElementsByClassName("star" +(i+1))[0];
            }

            function checkStars(cur,clicked){
                if(imageModel.getRating()==clicked){
                    return 0;

                }
                else{
                    return clicked;
                }
            }

            //Doesn't feel like working in a loop, thanks javascript
            ratingButton[0].addEventListener('click',function(){
                    var x =checkStars(imageModel.getRating(),1);
                     imageModel.setRating(x);
                    
                    drawStars(imageModel.getRating(),ratingButton);
                });
            ratingButton[1].addEventListener('click',function(){
                    var x =checkStars(imageModel.getRating(),2);
                     imageModel.setRating(x);
                    drawStars(imageModel.getRating(),ratingButton);
                });
            ratingButton[2].addEventListener('click',function(){
                    var x =checkStars(imageModel.getRating(),3);
                     imageModel.setRating(x);
                    drawStars(imageModel.getRating(),ratingButton);
                });
            ratingButton[3].addEventListener('click',function(){
                    var x =checkStars(imageModel.getRating(),4);
                     imageModel.setRating(x);
                    drawStars(imageModel.getRating(),ratingButton);
                });
            ratingButton[4].addEventListener('click',function(){
                    var x =checkStars(imageModel.getRating(),5);
                     imageModel.setRating(x);
                    drawStars(imageModel.getRating(),ratingButton);
                });
            drawStars(imageModel.getRating(),ratingButton);
        },

        /**
         * Changes the rendering of the ImageModel to either list or grid view.
         * @param viewType A string, either LIST_VIEW or GRID_VIEW
         */
        setToView: function(viewType) {
            if((viewType==LIST_VIEW||viewType==GRID_VIEW)){
                var layout = this.rendererDiv.getElementsByClassName("image-div")[0];
                var img = this.rendererDiv.getElementsByClassName("image-render")[0];
                this.curView=viewType;

                if(viewType==GRID_VIEW){
                    layout.style.width="40%";
                    img.style.width="100%";
                    img.style.float="none";
                    img.style.borderBottom="2px solid";
                    img.style.borderRight="none";
                }
                else if(viewType==LIST_VIEW){
                    layout.style.width="90%";
                    img.style.width="50%";
                    img.style.float="left";
                    img.style.borderBottom="none";
                    img.style.borderRight="2px solid";
                }
            }
        },

        /**
         * Returns a string of either LIST_VIEW or GRID_VIEW indicating which view type it is
         * currently rendering.
         */
        getCurrentView: function() {
            return this.curView;
        }
    });
    

    /**
     * A factory is an object that creates other objects. In this case, this object will create
     * objects that fulfill the ImageRenderer class's contract defined above.
     */
    var ImageRendererFactory = function() {
    };

    _.extend(ImageRendererFactory.prototype, {

        /**
         * Creates a new ImageRenderer object for the given ImageModel
         */
        createImageRenderer: function(imageModel) {
            // TODO
            var img = new ImageRenderer(imageModel);
            return img;
        }
    });

    /**
     * An object representing a DOM element that will render an ImageCollectionModel.
     * Multiple such objects can be created and added to the DOM (i.e., you shouldn't
     * assume there is only one ImageCollectionView that will ever be created).
     */
    var ImageCollectionView = function() {
        // TODO
        this.imageFactory;
        this.collectionModel;
        this.curView;
        this.rating;
        this._init();
    };

    _.extend(ImageCollectionView.prototype, {
        /**
         * Returns an element that can be attached to the DOM to display the ImageCollectionModel
         * this object represents.
         */


        _init: function(){
            var self = this;
            this.collectionDiv = document.createElement('div');
            var collectionTemplate = document.getElementById('collection-template');
            this.collectionDiv.appendChild(document.importNode(collectionTemplate.content, true));
            this.curView=GRID_VIEW;
            this.rating=0;
        },
        getElement: function() {
            // TODO
            return this.collectionDiv;
        },

        /**
         * Gets the current ImageRendererFactory being used to create new ImageRenderer objects.
         */
        getImageRendererFactory: function() {
            // TODO
            return this.imageFactory;
        },

        /**
         * Sets the ImageRendererFactory to use to render ImageModels. When a *new* factory is provided,
         * the ImageCollectionView should redo its entire presentation, replacing all of the old
         * ImageRenderer objects with new ImageRenderer objects produced by the factory.
         */
        setImageRendererFactory: function(imageRendererFactory) {
            // TODO
            var self=this;
            if(self.imageFactory!=imageRendererFactory){
                self.imageFactory = imageRendererFactory;
                if(self.collectionModel!=null){
                   redrawImages(self);
                }
            
            }
        },

        /**
         * Returns the ImageCollectionModel represented by this view.
         */
        getImageCollectionModel: function() {
            // TODO
             return this.collectionModel;
        },

        /**
         * Sets the ImageCollectionModel to be represented by this view. When setting the ImageCollectionModel,
         * you should properly register/unregister listeners with the model, so you will be notified of
         * any changes to the given model.
         */
        setImageCollectionModel: function(imageCollectionModel) {
            // TODO
            var self=this;
            var setImageCollectionListener = function(eventType, imageModelCollection, imageModel, eventDate){
                if(eventType=="IMAGE_ADDED_TO_COLLECTION_EVENT"){
                    redrawImages(self);
                }
        
            }
            if(self.collectionModel!=null){
                //remove listener from current model
                self.collectionModel.removeListener(setImageCollectionListener);
            }



            self.collectionModel=imageCollectionModel;

            self.collectionModel.addListener(setImageCollectionListener);
            if(self.imageFactory!=null){
                redrawImages(self);
            }
            

        },

        /**
         * Changes the presentation of the images to either grid view or list view.
         * @param viewType A string of either LIST_VIEW or GRID_VIEW.
         */
        setToView: function(viewType) {
            // TODO
            var self=this;
            if((viewType==LIST_VIEW||viewType==GRID_VIEW)){
                this.curView=viewType;
                redrawImages(self);
            }
        },

        /**
         * Returns a string of either LIST_VIEW or GRID_VIEW indicating which view type is currently
         * being rendered.
         */
        getCurrentView: function() {
            // TODO
            return this.curView;
        }
    });
    function redrawImages(imageCollectionView){
        while(imageCollectionView.collectionDiv.lastChild){
            imageCollectionView.collectionDiv.removeChild(imageCollectionView.collectionDiv.lastChild);
        }
        var collectionTemplate = document.getElementById('collection-template');
        imageCollectionView.collectionDiv.appendChild(document.importNode(collectionTemplate.content, true));
        var imageModels=imageCollectionView.collectionModel.getImageModels();

        var lessRating=[];
        for(var i=0;i<imageModels.length;i++){
            
            if(imageModels[i].getRating()<imageCollectionView.rating){
                
                lessRating.push(imageModels[i]);
            }

        }


        imageModels=_.difference(imageModels,lessRating);

        for(var i=0;i<imageModels.length;i++){
            var img = imageCollectionView.imageFactory.createImageRenderer(imageModels[i]);
            var x = img.getElement();
            img.setToView(imageCollectionView.getCurrentView());
            imageCollectionView.collectionDiv.appendChild(img.getElement());
        }
    }
    /**
     * An object representing a DOM element that will render the toolbar to the screen.
     */
    var Toolbar = function() {
        this.listeners=[];
        this.curView=LIST_VIEW;
        this.ratingFilter;
        this._init();
    };

    _.extend(Toolbar.prototype, {


        _init: function() {
            var self = this;
            this.toolbarDiv = document.createElement('div');
            var toolbarTemplate = document.getElementById('toolbar-template');
            this.toolbarDiv.appendChild(document.importNode(toolbarTemplate.content, true));

            var gridButton = this.toolbarDiv.getElementsByClassName("grid-view")[0];

            var gridText=this.toolbarDiv.getElementsByClassName("grid-text")[0];


            var listButton = this.toolbarDiv.getElementsByClassName("list-view")[0];


            var listText=this.toolbarDiv.getElementsByClassName("list-text")[0];
            listButton.addEventListener('click',function(){

                self.setToView(LIST_VIEW);
                gridButton.style.background="no-repeat url(./images/GridView.png)";
                gridButton.style.backgroundSize="100%";
                gridButton.style.borderColor = "#ffffff";
                gridText.style.textDecoration="none";
                gridText.style.color="#ffffff";

                listButton.style.background="no-repeat url(./images/ListViewActive.png)";
                listButton.style.borderColor = "#7fe282"
                listButton.style.backgroundSize="100%";
                listText.style.textDecoration="underline";
                listText.style.color="#7fe282";
            });

            gridButton.addEventListener('click',function(){

                self.setToView(GRID_VIEW);
                listButton.style.background="no-repeat url(./images/ListView.png)";
                listButton.style.backgroundSize="100%";
                 listButton.style.borderColor = "#ffffff";
                listText.style.textDecoration="none";
                listText.style.color="#ffffff";

                gridButton.style.background="no-repeat url(./images/GridViewActive.png)";
                gridButton.style.backgroundSize="100%";
                gridButton.style.borderColor = "#7fe282";
                gridText.style.textDecoration="underline";
                gridText.style.color="#7fe282";
            });



            var ratingButton=[];
            for(var i=0;i<5;i++){
                ratingButton[i]=this.toolbarDiv.getElementsByClassName("star" +(i+1))[0];
            }
            //Doesn't feel like working in a loop, thanks javascript
            ratingButton[0].addEventListener('click',function(){
                    self.setRatingFilter(1);
                });
            ratingButton[1].addEventListener('click',function(){
                    self.setRatingFilter(2);
                });
            ratingButton[2].addEventListener('click',function(){
                    self.setRatingFilter(3);
                });
            ratingButton[3].addEventListener('click',function(){
                    self.setRatingFilter(4);
                });
            ratingButton[4].addEventListener('click',function(){
                    self.setRatingFilter(5);
                });
            var listButton = this.toolbarDiv.getElementsByClassName("list-view")[0];
            var listText=this.toolbarDiv.getElementsByClassName("list-text")[0];

            gridButton.click();
           


        },



        /**
         * Returns an element representing the toolbar, which can be attached to the DOM.
         */
        getElement: function() {
            // TODO
            return this.toolbarDiv;
        },

        /**
         * Registers the given listener to be notified when the toolbar changes from one
         * view type to another.
         * @param listener_fn A function with signature (toolbar, eventType, eventDate), where
         *                    toolbar is a reference to this object, eventType is a string of
         *                    either, LIST_VIEW, GRID_VIEW, or RATING_CHANGE representing how
         *                    the toolbar has changed (specifically, the user has switched to
         *                    a list view, grid view, or changed the star rating filter).
         *                    eventDate is a Date object representing when the event occurred.
         */
        addListener: function(listener_fn) {
            // TODO
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to Toolbar.addListener: " + JSON.stringify(arguments));
            }

            this.listeners.push(listener_fn);
        },

        /**
         * Removes the given listener from the toolbar.
         */
        removeListener: function(listener_fn) {
            // TODO
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to Toolbar.removeListener: " + JSON.stringify(arguments));
            }
            this.listeners = _.without(this.listeners, listener_fn);
        },

        /**
         * Sets the toolbar to either grid view or list view.
         * @param viewType A string of either LIST_VIEW or GRID_VIEW representing the desired view.
         */
        setToView: function(viewType) {
            if((viewType==LIST_VIEW||viewType==GRID_VIEW)){
                this.curView=viewType;
                 var object=this;
                _.each(this.listeners, function(listener) {
                    listener(object,viewType, (new Date()).getTime());
                });
            }
        },

        /**
         * Returns the current view selected in the toolbar, a string that is
         * either LIST_VIEW or GRID_VIEW.
         */
        getCurrentView: function() {
            return this.curView;
        },

        /**
         * Returns the current rating filter. A number in the range [0,5], where 0 indicates no
         * filtering should take place.
         */
        getCurrentRatingFilter: function() {
            return this.ratingFilter;
        },

        /**
         * Sets the rating filter.
         * @param rating An integer in the range [0,5], where 0 indicates no filtering should take place.
         */
        setRatingFilter: function(rating) {
            // TODO

            if(rating>=0&&rating<=5){

                var ratingButton =[];
                var prev = this.getCurrentRatingFilter();
                for(var i=0;i<5;i++){
                    ratingButton[i]=this.toolbarDiv.getElementsByClassName("star" +(i+1))[0];
                }
                
                if(prev==rating){
                    this.ratingFilter=0;
                    drawStars(0,ratingButton);
                }
                else{
                    this.ratingFilter=rating;
                    drawStars(rating,ratingButton);
                }
                var listeners = this.listeners;
                var object=this;
                _.each(listeners, function(listener) {
                    listener(object,RATING_CHANGE, (new Date()).getTime());
                })   
            }
        }
    });
    //Change star images to reflect current
    function drawStars(stars,ratingButton){
        for(var i=0;i<5;i++){
            if(i<stars){
                ratingButton[i].style.background="no-repeat url(./images/StarActive.png)";
            }
            else{
                ratingButton[i].style.background="no-repeat url(./images/star.png)";
            }
            ratingButton[i].style.backgroundSize="100%";
        }



    }
    /**
     * An object that will allow the user to choose images to display.
     * @constructor
     */
    var FileChooser = function() {
        this.listeners = [];
        this._init();
    };

    _.extend(FileChooser.prototype, {
        // This code partially derived from: http://www.html5rocks.com/en/tutorials/file/dndfiles/
        _init: function() {
            var self = this;
            this.fileChooserDiv = document.createElement('div');
            var fileChooserTemplate = document.getElementById('file-chooser');
            this.fileChooserDiv.appendChild(document.importNode(fileChooserTemplate.content, true));
            var fileChooserInput = this.fileChooserDiv.querySelector('.files-input');
            fileChooserInput.addEventListener('change', function(evt) {
                var files = evt.target.files;
                var eventDate = new Date();
                _.each(
                    self.listeners,
                    function(listener_fn) {
                        listener_fn(self, files, eventDate);
                    }
                );
            });
        },

        /**
         * Returns an element that can be added to the DOM to display the file chooser.
         */
        getElement: function() {
            return this.fileChooserDiv;
        },

        /**
         * Adds a listener to be notified when a new set of files have been chosen.
         * @param listener_fn A function with signature (fileChooser, fileList, eventDate), where
         *                    fileChooser is a reference to this object, fileList is a list of files
         *                    as returned by the File API, and eventDate is when the files were chosen.
         */
        addListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to FileChooser.addListener: " + JSON.stringify(arguments));
            }

            this.listeners.push(listener_fn);
        },

        /**
         * Removes the given listener from this object.
         * @param listener_fn
         */
        removeListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to FileChooser.removeListener: " + JSON.stringify(arguments));
            }
            this.listeners = _.without(this.listeners, listener_fn);
        }
    });

    // Return an object containing all of our classes and constants
    return {
        ImageRenderer: ImageRenderer,
        ImageRendererFactory: ImageRendererFactory,
        ImageCollectionView: ImageCollectionView,
        Toolbar: Toolbar,
        FileChooser: FileChooser,

        LIST_VIEW: LIST_VIEW,
        GRID_VIEW: GRID_VIEW,
        RATING_CHANGE: RATING_CHANGE
    };
}