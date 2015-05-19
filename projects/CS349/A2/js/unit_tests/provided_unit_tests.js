'use strict';

var expect = chai.expect;

describe('Provided unit tests', function() {


	it('Listener unit test for ImageModel', function() {
		var modelModule =createModelModule();
        var imageModel = new modelModule.ImageModel(
                        '/images/GOPR0042-small.jpg',
                        new Date(),
                        'Captions sister',
                        0
                    );
        var firstListener = sinon.spy();

        imageModel.addListener(firstListener);
        var x = "caption";
        imageModel.setCaption(x);
        expect(firstListener.calledWith(imageModel, sinon.match.any), 'ImageModel caption argument verification').to.be.true;
        imageModel.setRating(3);
        expect(firstListener.calledWith(imageModel, sinon.match.any), 'ImageModel rating argument verification').to.be.true;
        expect(firstListener.callCount, 'ImageModel first listener should have been called twice').to.equal(2);
        imageModel.removeListener(firstListener);
        imageModel.setCaption("New caption");
        imageModel.setRating(3);
        expect(firstListener.callCount, 'ImageModel first listener should have been called twice').to.equal(2);
    });

	it('ImageModel Functions', function() {
		var modelModule =createModelModule();
		var date = new Date();
        var imageModel = new modelModule.ImageModel(
                        '/images/GOPR0042-small.jpg',
                        date,
                        'Captions sister',
                        4
                    );
        expect(imageModel.getCaption()=="Captions sister", 'ImageModel caption argument verification').to.be.ok;
        imageModel.setCaption("caption");
        expect(imageModel.getCaption()=="caption", 'ImageModel caption argument verification').to.be.ok;

        expect(imageModel.getRating()==4, 'ImageModel rating argument verification').to.be.ok;
        imageModel.setRating(5);
        expect(imageModel.getRating()==5, 'ImageModel rating argument verification').to.be.ok;

        expect(imageModel.getPath()=="/images/GOPR0042-small.jpg", 'ImageModel path argument verification').to.be.ok;
		expect(imageModel.getModificationDate()==date, 'ImageModel modification argument verification').to.be.ok;        

    });
	it('ImageCollectionModel Adding EventListeners', function() {
		var modelModule =createModelModule();
		var date = new Date();
        var collection = new modelModule.ImageCollectionModel();
        var imageModel1 = new modelModule.ImageModel(
                        'img1',
                        date,
                        'c1',
                        2
                    );

         var firstListener = sinon.spy();
         collection.addListener(firstListener);
         collection.addImageModel(imageModel1);
         expect(firstListener.calledWith('IMAGE_ADDED_TO_COLLECTION_EVENT',collection,imageModel1,sinon.match.any), 'ImageCollectionModel adding ImageModel argument verification').to.be.true;
         imageModel1.setCaption("Changed");
         expect(firstListener.calledWith('IMAGE_META_DATA_CHANGED_EVENT',collection,imageModel1,sinon.match.any), 'ImageCollectionModel changing imagemodel argument verification').to.be.true;
         var secListener = sinon.spy();
         collection.addListener(secListener);
  		 imageModel1.setRating(0);
         expect(firstListener.calledWith('IMAGE_META_DATA_CHANGED_EVENT',collection,imageModel1,sinon.match.any), 'ImageCollectionModel changing imagemodel argument verification').to.be.true;
         expect(secListener.calledWith('IMAGE_META_DATA_CHANGED_EVENT',collection,imageModel1,sinon.match.any), 'ImageCollectionModel changing imagemodel argument verification').to.be.true;
         collection.removeImageModel(imageModel1);
         expect(firstListener.calledWith('IMAGE_REMOVED_FROM_COLLECTION_EVENT',collection,imageModel1,sinon.match.any), 'ImageCollectionModel removing ImageModel argument verification').to.be.true;
         expect(secListener.calledWith('IMAGE_REMOVED_FROM_COLLECTION_EVENT',collection,imageModel1,sinon.match.any), 'ImageCollectionModel removing ImageModel argument verification').to.be.true;



         expect(firstListener.callCount, 'ImageModel first listener should have been called 4 times').to.equal(4);
         expect(secListener.callCount, 'ImageModel first listener should have been called twice').to.equal(2);
    });
	
	it('ImageCollectionModel Removing EventListeners, changing imagemodel after removed', function() {
		var modelModule =createModelModule();
		var date = new Date();
        var collection = new modelModule.ImageCollectionModel();
        var imageModel1 = new modelModule.ImageModel(
                        'img1',
                        date,
                        'c1',
                        2
                    );
        var imageModel2 = new modelModule.ImageModel(
                        'img2',
                        date,
                        'c2',
                        5
                    );

         var firstListener = sinon.spy();
         collection.addListener(firstListener);
         collection.addImageModel(imageModel1);

         imageModel1.setCaption("Changed");

         var secListener = sinon.spy();
         collection.addListener(secListener);
         collection.addImageModel(imageModel2);
  		 imageModel1.setRating(0);
         collection.removeListener(secListener);

         imageModel1.setRating(4);
         imageModel2.setCaption("")
         collection.removeImageModel(imageModel1);
         imageModel1.setRating(3);
         

         imageModel1.setRating(3);
         imageModel1.setRating(3);
         imageModel1.setRating(3);
         expect(firstListener.callCount, 'ImageModel first listener should have been called 7 times').to.equal(7);

         expect(secListener.callCount, 'ImageModel second listener should have been called twice').to.equal(2);
    });
	it('ImageCollectionModel Functions', function() {
		var modelModule =createModelModule();
		var date = new Date();
		var collection=new modelModule.ImageCollectionModel();
        var imageModel1 = new modelModule.ImageModel(
                        'img1',
                        date,
                        'c1',
                        2
                    );
        var imageModel2 = new modelModule.ImageModel(
                        'img2',
                        date,
                        'c2',
                        5
                    );
        collection.addImageModel(imageModel2);
        collection.addImageModel(imageModel1);
        var x = [imageModel2,imageModel1];

        expect(_.isEqual(collection.getImageModels(),x),  'ImageCollectionModel get image models verification').to.be.ok;
    

    });


});
