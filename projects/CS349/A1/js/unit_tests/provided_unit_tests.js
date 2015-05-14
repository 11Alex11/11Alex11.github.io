'use strict';

var expect = chai.expect;
describe('First unit test', function() {

    it('Some tests', function() {
        /*
         We're using Mocha and Chai to do unit testing.

         Mocha is what sets up the tests (the "describe" and "it" portions), while
         Chai does the assertion/expectation checking.

         Links:
         Mocha: http://mochajs.org
         Chai: http://chaijs.com

         Note: This is a bunch of tests in one it; you'll probably want to separate them
         out into separate groups to make debugging easier. It's also more satisfying
         to see a bunch of unit tests pass on the results page :)
        */

        // Here is the most basic test you could think of:
        expect(1==1, '1==1').to.be.ok;

        // You can also for equality:
        expect(1, '1 should equal 1').to.equal(1);

        // JavaScript can be tricky with equality tests
        expect(1=='1', "1 should == '1'").to.be.true;

        // Make sure you understand the differences between == and ===
        expect(1==='1', "1 shouldn't === '1'").to.be.false;

        // Use eql for deep comparisons
        expect([1] == [1], "[1] == [1] should be false because they are different objects").to.be.false;

        expect([1], "[1] eqls [1] should be true").to.eql([1]);
    });

    it('Callback demo unit test', function() {
        /*
        Suppose you have a function or object that accepts a callback function,
        which should be called at some point in time (like, for example, a model
        that will notify listeners when an event occurs). Here's how you can test
        whether the callback is ever called.
         */

        // First, we'll create a function that takes a callback, which the function will
        // later call with a single argument. In tests below, we'll use models that
        // take listeners that will be later called
        var functionThatTakesCallback = function(callbackFn) {
            return function(arg) {
                callbackFn(arg);
            };
        };

        // Now we want to test if the function will ever call the callbackFn when called.
        // To do so, we'll use Sinon's spy capability (http://sinonjs.org/)
        var spyCallbackFn = sinon.spy();

        // Now we'll create the function with the callback
        var instantiatedFn = functionThatTakesCallback(spyCallbackFn);

        // This instantiated function should take a single argument and call the callbackFn with it:
        instantiatedFn("foo");

        // Now we can check that it was called:
        expect(spyCallbackFn.called, 'Callback function should be called').to.be.ok;

        // We can check the number of times called:
        expect(spyCallbackFn.callCount, 'Number of times called').to.equal(1);

        // And we can check that it got its argument correctly:
        expect(spyCallbackFn.calledWith('foo'), 'Argument verification').to.be.true;

        // Or, equivalently, get the first argument of the first call:
        expect(spyCallbackFn.args[0][0], 'Argument verification 2').to.equal('foo');

        // This should help you understand the listener testing code below
    });

    it('Listener unit test for GraphModel', function() {
        var graphModel = new GraphModel();
        var firstListener = sinon.spy();

        graphModel.addListener(firstListener);
        graphModel.selectGraph("MyGraph");

        expect(firstListener.called, 'GraphModel listener should be called').to.be.ok;
        expect(firstListener.calledWith('GRAPH_SELECTED_EVENT', sinon.match.any, 'MyGraph'), 'GraphModel argument verification').to.be.true;

        var secondListener = sinon.spy();
        graphModel.addListener(secondListener);
        graphModel.selectGraph("MyGraph");
        expect(firstListener.callCount, 'GraphModel first listener should have been called twice').to.equal(2);
        expect(secondListener.called, "GraphModel second listener should have been called").to.be.ok;
    });
    it('Test1 - ActivityModel adding/removing points', function() {
        var activityModel = new ActivityStoreModel();
        var firstListener = sinon.spy();
        activityModel.addListener(firstListener);
        var point1 = new ActivityData(
            "Activity 1",
            {
                energyLevel: 4,
                stressLevel:2,
                happinessLevel: 1
            },
            43
        );

        activityModel.addActivityDataPoint(point1);
        expect(firstListener.called, 'First listener should be called').to.be.ok;
        expect(firstListener.calledWith('ACTIVITY_DATA_ADDED_EVENT', sinon.match.any, point1), 'ActivityModel argument verificatio for add point').to.be.true;

        var secondListener = sinon.spy();
        activityModel.addListener(secondListener);
        generateFakeData(activityModel,9);

        expect(firstListener.callCount, 'ActivityModel first listener should have been called 10 times').to.equal(10);
        expect(secondListener.callCount, "ActivityModel second listener should have been 9").to.equal(9);

        activityModel.removeActivityDataPoint(point1);
        expect(secondListener.calledWith('ACTIVITY_DATA_REMOVED_EVENT', sinon.match.any, point1), 'ActivityModel argument verificatio for remove point').to.be.true;
        expect(secondListener.callCount, "ActivityModel second listener should have been 10").to.equal(10);
       
    });
    it('Test2 - ActivityModel add/remove event listener', function() {
        var activityModel = new ActivityStoreModel();
        var firstListener = sinon.spy();
        activityModel.addListener(firstListener);

        generateFakeData(activityModel,1);

        expect(firstListener.callCount, 'ActivityModel listener should have been called 1 time').to.equal(1);
        
        activityModel.removeListener(firstListener);
        generateFakeData(activityModel,10);

        expect(firstListener.callCount, "ActivityModel  listener removed so it should have been 1").to.equal(1);
       
    });
    it('Test3 - ActivityModel remove non-existant point', function() {
        var activityModel = new ActivityStoreModel();
        var firstListener = sinon.spy();
        activityModel.addListener(firstListener);
        var point1 = new ActivityData(
            "Activity 1",
            {
                energyLevel: 4,
                stressLevel:2,
                happinessLevel: 1
            },
            43
        );
        generateFakeData(activityModel,1);

        expect(firstListener.callCount, 'ActivityModel listener should have been called 1 time').to.equal(1);
        
        activityModel.removeListener(firstListener);
        generateFakeData(activityModel,10);

        expect(firstListener.callCount, "ActivityModel  listener removed so it should have been 1").to.equal(1);
       
    });
    it('Test4 - GraphModel add/remove event listener', function() {
        var graphModel = new GraphModel();
        var firstListener = sinon.spy();
        graphModel.addListener(firstListener);

        graphModel.selectGraph("bar");
        graphModel.selectGraph("scatter");

        expect(firstListener.callCount, 'GraphModel listener should have been called 2 times').to.equal(2);
        graphModel.removeListener(firstListener);
        graphModel.selectGraph("test");

        expect(firstListener.callCount, "GraphModel  listener removed so it should have been 2").to.equal(2);
       
    });
    it('Test5 - GraphModel and ActivityModel data functions', function() {
        var graphModel = new GraphModel();
        var activityModel = new ActivityStoreModel();

        graphModel.selectGraph("bar");
        graphModel.selectGraph("scatter");
        expect(graphModel.getAvailableGraphNames()[0]=="bar","GraphModel First element should be bar").to.be.ok;
        expect(graphModel.getAvailableGraphNames()[1]=="scatter","GraphModel Second element should be scatter").to.be.ok;
        expect(graphModel.getAvailableGraphNames().length==2,"GraphModel First element should be bar").to.be.ok;
        expect(graphModel.getNameOfCurrentlySelectedGraph()=="scatter","GraphModel Current should be scatter").to.be.ok;

       var point1 = new ActivityData(
            "Activity 1",
            {
                energyLevel: 4,
                stressLevel:2,
                happinessLevel: 1
            },
            43
        );
       activityModel.addActivityDataPoint(point1);
       var point2 = new ActivityData(
            "Activity 2",
            {
                energyLevel: 4,
                stressLevel:4,
                happinessLevel: 1
            },
            4
        );
       activityModel.addActivityDataPoint(point2);
       var point3 = new ActivityData(
            "Activity 3",
            {
                energyLevel: 1,
                stressLevel:5,
                happinessLevel: 2
            },
            3
        );
       activityModel.addActivityDataPoint(point3);
       expect(_.isEqual(activityModel.getActivityDataPoints()[0],point1),"ActivityModel First point check").to.be.ok;
        expect(_.isEqual(activityModel.getActivityDataPoints()[1],point2),"ActivityModel Second point check").to.be.ok;
        expect(_.isEqual(activityModel.getActivityDataPoints()[2],point3),"ActivityModel Third point check").to.be.ok;
        expect(activityModel.getActivityDataPoints().length,"ActivityModel Length should be 3").to.equal(3);
    });

});
