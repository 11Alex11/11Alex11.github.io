'use strict';

// This should be your main point of entry for your app

window.addEventListener('load', function() {
    var modelModule = createModelModule();
    var viewModule = createViewModule();
    

    var appContainer = document.getElementById('app-container');
    var imgDiv = document.getElementById("image-wrapper");

    // Attach the file chooser to the page. You can choose to put this elsewhere, and style as desired
    var toolbar = new viewModule.Toolbar();
    appContainer.insertBefore(toolbar.getElement(),appContainer.childNodes[0]);
    var fileDiv=toolbar.getElement().getElementsByClassName("file-wrapper")[0];
    var collectionDiv=document.getElementById("image-wrapper");
    var fileChooser = new viewModule.FileChooser();
    fileDiv.insertBefore(fileChooser.getElement(),fileDiv.childNodes[0]);


    var imageCollectionView = new viewModule.ImageCollectionView();
    var imageCollectionModel =modelModule.loadImageCollectionModel();
    var imageFactory = new viewModule.ImageRendererFactory();
    imageCollectionView.setImageRendererFactory(imageFactory);
    imageCollectionView.setImageCollectionModel(imageCollectionModel);
    collectionDiv.appendChild(imageCollectionView.getElement());

    toolbar.addListener(function(tb, eventType, eventDate){
        if(eventType=="LIST_VIEW"||eventType=="GRID_VIEW"){
            imageCollectionView.setToView(eventType);
        }
        else if(eventType=="RATING_CHANGE"){
            imageCollectionView.rating=tb.getCurrentRatingFilter();
            imageCollectionView.setToView(imageCollectionView.getCurrentView());
        }

    });

    // Demo that we can choose files and save to local storage. This can be replaced, later
    fileChooser.addListener(function(fileChooser, files, eventDate) {
       
        _.each(
            files,
            function(file) {
               // var newDiv = document.createElement('div');
               // var fileInfo = "File name: " + file.name + ", last modified: " + file.lastModifiedDate;
               // newDiv.innerText = fileInfo;
               // appContainer.appendChild(newDiv);
                imageCollectionModel.addImageModel(
                    new modelModule.ImageModel(
                        '/images/' + file.name,
                        file.lastModifiedDate,
                        'Sample Caption',
                        0
                    ));
            }
        );
        modelModule.storeImageCollectionModel(imageCollectionModel);
    });
    // Demo retrieval
    var storedImageCollection = modelModule.loadImageCollectionModel();
   // var storedImageDiv = document.createElement('div');
   // _.each(
  //      storedImageCollection.getImageModels(),
  //      function(imageModel) {
           // var imageModelDiv = document.createElement('div');
           // imageModelDiv.innerText = "ImageModel from storage: " + JSON.stringify(imageModel);
            //storedImageDiv.appendChild(imageModelDiv);
  //     }
  //  );
   // appContainer.appendChild(storedImageDiv);


    window.addEventListener('beforeunload', function() {
        modelModule.storeImageCollectionModel(imageCollectionModel) 
    });


});

