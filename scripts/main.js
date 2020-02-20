

// #########################################################################################################################
// BUDGET CONTROLLER ########################################################################################################
var JackpotController = (function() {

    var AllFilledCoupons = {}; //an object. to save all the filled coupons.
    var totalCosts = 0;
    const oneCouponPrice = 1.2;

    // object function constructor of coupon
    var Coupon = function(num) {
        this.numbersPicked = num;
    };


    // helping function to create a new coupon object.
    function createCoupon(num) { return new Coupon(num); }

    return {

        // add coupon object to the AllFilledCoupons object. 
        addCoupon: function(num,name) {
            AllFilledCoupons[name] = createCoupon(num); 
            // console.log('we just added an item from the allCoupons object');
            console.log(AllFilledCoupons);
        },

        // it removes a coupon from the data structure. only if it exists.
        removeCoupon: function(id) {
            //check if it exits first
            if(this.hasCoupon(id)) {
                delete AllFilledCoupons[id]; // delete element from an object based on the key.
                // console.log('we just deleted an item from the allCoupons object');
                console.log(AllFilledCoupons);
            }
            
        },

        // delete all coupons at once.
        deleteAllCoupons: function(){
            for(var member in AllFilledCoupons) delete AllFilledCoupons[member]; // nice way to loop through all elements.
            // console.log('we just deleted all coupons');
            console.log(AllFilledCoupons);
        },

        //checks if the coupon exists in the AllFilledCoupons object based on the id of the targetCoupon .return 1 if yes, it has it.
        hasCoupon: function(id) {
            var temp = 0;
            var keysOfCouponsFilled = Object.keys(AllFilledCoupons); // return an array with the keys as elements (as strings)
            for(var i = 0 ; i < keysOfCouponsFilled.length ; i++){ if(keysOfCouponsFilled[i] === id) { temp = 1 ;} }
            return temp;
        },

        getAllCoupons: function() {  return AllFilledCoupons; },

        getTotal : function() { return totalCosts; },

         // it calculates the total . and assign it the totalCosts variable. 
        calculateTotal: function(){
            var numberOfSavedCoupons = Object.keys(this.getAllCoupons()).length;
            totalCosts = parseFloat(numberOfSavedCoupons * oneCouponPrice)  // one coupon costs 2€ 
        }

    }

})();




// ######################################################################################################################
// UI ####################################################################################################################
var UIController = (function() {
    const oneCouponPrice = 1.2;
    var expandedCouponID;
    var expandedCoupon;

    var main_transition_duration = 190;  //just lil bit longer than the transition of the animated elements to make sure , everything goes smoothly.

    var selectedElementIs = {
        infoButton          : document.getElementById('info-button'),
        couponsWrapper      : document.querySelector('.coupons-wrapper'),
        allCoupons          : document.querySelectorAll('.coupon'),
        couponsTitle        : document.querySelectorAll('.coupon__title'),
        allNumbersOfCoupons : document.querySelectorAll('.coupon__number'),

        allFields           : document.querySelectorAll('.field'),    
        allNumbersOfFields  : document.querySelectorAll('.field__number'),

        goBackButton        : document.querySelector('.goback'),
        deleteAllButton     : document.querySelector('.deleteAll'),
        nextCouponButton    : document.querySelector('.nextCoupon'),
        doneFillingButton   : document.querySelector('.doneFillingBtn'),

        quickTips           : document.querySelector('.quickTips'),

        randomButton        : document.querySelector('#quickTipsItemRandomButton'),
        astroButton         : document.querySelector('#quickTipsItemAstroButton'),
        statisticButton     : document.querySelector('#quickTipsItemStatisticButton'),

        oneField            : document.getElementById('#1-Fields'),
        threeFields         : document.getElementById('#3-Fields'),
        sixFields           : document.getElementById('#6-Fields'),
        fillAllCouponsButton: document.getElementById('fillAllCouponsBtn'),
        chooseRandomNumPopup:document.querySelector('#popupRandomButton'),

        astroPopup          : document.getElementById('popupAstroButton'),        
        allAstroButtons     : document.querySelectorAll('.randomNumbers-popup__button--astro'),
    
        statisticPopup      : document.getElementById('popupStatisticButton'),

        allPopups           : document.querySelectorAll('.randomNumbers-popup'),
        closePopupIcon      : document.querySelector('.randomNumbers-popup__cancel-logo'), 
        allPopupsContainer  : document.querySelector('.allPopups'),
        price               : document.querySelector('.costs__price') 
        
    };

    var DOMStrings = {
        oneField: '1-Fields' ,
        threeFields: '3-Fields' ,
        sixFields: '6-Fields' ,
        closePopupIcon: 'randomNumbers-popup__cancel-logo' ,
        allPopups: 'randomNumbers-popup',
        astroButton: 'randomNumbers-popup__button--astro',
        statisticButton: 'randomNumbers-popup__button--statistik'

    };

    // It makes all coupons unclickable except the first one. which is bascially the start UI state.
    function allExceptTheFirstCouponUnclickable(){
        var allCoupons = selectedElementIs.allCoupons;
        for(var i = 1 ; i < allCoupons.length ; i++) {
            allCoupons[i].classList.remove('release-interaction');
            allCoupons[i].classList.add('block-interaction');
        }
    }

    //delete all checked fields. basically a reset.
    function deleteAllFieldGlobally() {
        //loop through all the lil squares. if one of them has the svg element. remove that.
        for(var i = 0 ; i < selectedElementIs.allFields.length ; i++){
            if(selectedElementIs.allFields[i].childElementCount == 2) {
                selectedElementIs.allFields[i].firstElementChild.remove();
            }
        }
    }

    // it makes all numbers of all coupons visible.
    function showNumbersOfallCoupons() {
        for(var i = 0 ; i < selectedElementIs.allNumbersOfCoupons.length ; i++) {
            selectedElementIs.allNumbersOfCoupons[i].classList.remove('hide');
        } 
    }

    // it hides the number a coupon . // do we even need this function ??????
   /*  function hideNumberOfOneCoupon(nextCouponId) {
        var indexTemp , indexTempInt , targetIndex , targetNumber;

        indexTemp = nextCouponId[nextCouponId.length-1] //we extract the index from the id
        indexTempInt = parseInt(indexTemp);
        targetIndex = indexTempInt - 1 ;  // because coupons starts from 1 . and numbers start from 0
        targetNumber = selectedElementIs.allNumbersOfCoupons[targetIndex];
        targetNumber.classList.add('hide');
    } */


    //it hides all fields of all couponds. this is called by SetInitialUI function.
    function hideAllFields() {
        // children of coupon (number + fields) they start hidden. . then we toggle the class show
        for(var i = 1 ; i < selectedElementIs.allCoupons.length ; i++) {
            var allKidsOfCoupon = selectedElementIs.allCoupons[i].children;
            for(j = 1 ; j < allKidsOfCoupon.length ; j++) {  allKidsOfCoupon[j].classList.add('hide'); }
        }
    }

    // it shows the title of the expanded coupon.
    function showTitle() {
        UIController.getExpandedCoupon().firstElementChild.firstElementChild.classList.add('show');  // this is how a private function , calls a public one of the same module.
    }

    // it hides the title of the expanded coupon.
    function hideTitle() {
        UIController.getExpandedCoupon().firstElementChild.firstElementChild.classList.remove('show');
    }

    // it displays the coupons when we first load the page.
    function displayCoupons() {
        var allCoupons = selectedElementIs.allCoupons;

        for(let i = 0 ; i < allCoupons.length ; i++) {
            (function() {
                setTimeout(function(){  // display coupons one after the other ==> Nice Animation
                    var allCoupons = selectedElementIs.allCoupons;
                    allCoupons[i].classList.add('show');
                } ,222 * i); //you need to wait a lil bit.
            })(i);
         }
    }

    function getPrice() {
        return selectedElementIs.price.textContent;
    }

    return {
        
        // it opens the FillRandomlyPopup : the UI responsible for selectin how many coupons to fill randomly. 
        openFillRandomlyPopup: function(){
            selectedElementIs.chooseRandomNumPopup.classList.add('show');
            selectedElementIs.chooseRandomNumPopup.firstElementChild.classList.add('showPopup');
        },

        // it opens whether one of the quicktips popups , or the info popup
        openPopup: function() {
            var elementClickedID;
            var exactType ; // string : the type of the popup we want to open.
            var exactPopupID;  // string : the exact id of the popup we want to open. 
            var elementClickedID = event.target.id;

            //if this method is invoked by the info button
            if(elementClickedID.includes('info')) { exactType = "Info"; }

            // otherwise it is invoked by the quicktips buttons and we must extract the specific type of the popup based on its ID.
            else { exactType = elementClickedID.substring(13, elementClickedID.length); }      
        
            // we add that type to the second part of the id of the target popup
            exactPopupID = 'popup' + exactType;
            document.getElementById(exactPopupID).classList.add('show');
            document.getElementById(exactPopupID).firstElementChild.classList.add('showPopup'); //we have different utility classes , cause some have different animation beahvior.
        },

        // it closes the currently opened popup.
        closePopup: function() {
            var elementClicked   =  event.target;
            var elementClickedID = elementClicked.id;
            if(elementClicked.classList.contains(DOMStrings.allPopups) == true   || elementClicked.classList.contains(DOMStrings.closePopupIcon) == true 
            || elementClickedID.includes('Fields') || elementClicked === selectedElementIs.fillAllCouponsButton 
            || elementClicked.classList.contains(DOMStrings.astroButton)
            || elementClicked.classList.contains(DOMStrings.statisticButton) ) {                                
                //determine which popup window is shown so you can close it.
                var allPopups = selectedElementIs.allPopups;
                for(var i = 0 ; i  < allPopups.length ; i++) {
                    if(allPopups[i].classList.contains('show')) {
                        allPopups[i].classList.remove('show');
                        allPopups[i].firstElementChild.classList.remove('showPopup');
                    }
                }
            }  
        },

        setInitialUI: function() {
            displayCoupons();
            deleteAllFieldGlobally()
            showNumbersOfallCoupons();
            hideAllFields();
            allExceptTheFirstCouponUnclickable();
        },

        // returns the element itself. (you can then extract the id or class from it)
        getExpandedCoupon: function() {
            //this is public function , that being used by other modules , as well as by other sibling public methods. in the latter case , you HAVE to add 'this' when invokin it.
                for(var i = 0 ; i <  selectedElementIs.allCoupons.length ; i++){
                    if(selectedElementIs.allCoupons[i].classList.contains('coupon--big')) { return selectedElementIs.allCoupons[i]; }
                }
        },

        getSelectedElementIs: function() {  return selectedElementIs; },

        getDOMStrings: function() { return DOMStrings; },

        //returns an array with the numbers of the checked fields. it can take a coupon as an argument.
        getCheckedFields: function(couponToCheck){
            var targetCoupon;
            // if it is called without an argument. then run it on the expanded coupon.
            if(typeof couponToCheck === "undefined") { targetCoupon = this.getExpandedCoupon() ; } else { targetCoupon = couponToCheck; }

            var checkedFields = [];  // array to hold all integers. numbers of all checked fields.
            var allFields = targetCoupon.children;   // NodeList of all fields of the target coupon.

            // loop from 1 till 25.
            for(var i = 1 ; i < allFields.length ; i++) { 
                if(allFields[i].childElementCount == 2) { checkedFields.push(i); } // if the element field has two children. it means the <img> cross is inserted. it means it IS checked.
            }
            return checkedFields;
        },

        // return a coupon element . based on id
        getCoupon: function(nextCouponId) {
            var allCoupons = selectedElementIs.allCoupons;
            for(var i = 0 ; i < allCoupons.length ; i++) {
                if( allCoupons[i].id === nextCouponId) {
                    return allCoupons[i];
                }
            }
        },

        // it exapnds  a coupon. (alot of steps to achieve the desired animation)
        expandCoupon: function(cpnId) { 
            var CouponClicked , CouponClickedID , CouponClickedChildren;

            CouponClicked = document.getElementById(cpnId);
            CouponClickedID = cpnId;
            CouponClickedChildren = CouponClicked.children;
            expandedCouponID = CouponClickedID;
            expandedCoupon   =  document.getElementById(expandedCouponID);
        
            //go through with this function only if there is an ID.
            if(expandedCouponID !== '') {
                //////// 1)the whole coupon wrapper schrinks a lil bit towards the middle & become a bit transparent
                selectedElementIs.couponsWrapper.classList.add('shrink-couponsWrapper');

                //////// 2) the clicked coupon quickly fully expands , in its tiny form inside of the shrinked wrapper.
               (function expandWhileStillTiny(){
                    // make the clicked coupon big
                    CouponClicked.classList.add('coupon--big');
                
                    // make the other coupons disappear
                    for(var i = 0 ; i < selectedElementIs.allCoupons.length ; i++) {
                            if(selectedElementIs.allCoupons[i].id !== CouponClickedID)  {
                                selectedElementIs.allCoupons[i].classList.add('display-none');
                            }
                    }

                    // make the fields big . careful : skip the first element. its numbers container !
                    for(var i = 1 ; i < CouponClickedChildren.length ; i++){
                        CouponClickedChildren[i].classList.remove('hide');
                        CouponClickedChildren[i].classList.add('field--goingBig');
                    }      
        
                    //make the numbers of fields appear
                    for(var i = 0 ; i < selectedElementIs.allFields.length ; i++) { selectedElementIs.allNumbersOfFields[i].classList.add('show'); }       
                 
                    //we hide the number of that coupon
                    expandedCoupon.firstElementChild.lastElementChild.classList.add('hide');
                })();

                //////// 3) from the middle . the  already expanded coupon scales up in nice transition to 1. this done by returin the scale of wrapper back to 1.
                setTimeout(function(){ selectedElementIs.couponsWrapper.classList.remove('shrink-couponsWrapper');}, main_transition_duration); //you need to wait a lil bit.

                showTitle();
            }
        },
        
        // it shrinks  a coupon. (alot of steps to achieve the desired animation)
        shrinkCoupon: function() { 
            expandedCoupon = this.getExpandedCoupon();
            hideTitle();
            
            //////// 1) the wrapper shrinks.
            selectedElementIs.couponsWrapper.classList.add('shrink-couponsWrapper');

            /////// 2) make the coupon small (and show it along the other coupons . aka the initial UI.)
           (function schrinkCouponMain() {
                //we make the opened coupon shrink. => to its initial state
                expandedCoupon.classList.remove('coupon--big');
            
                //we make all other coupons appear again. alongside with the previously opened one.
                for(var i = 0 ; i < selectedElementIs.allCoupons.length ; i++) { selectedElementIs.allCoupons[i].classList.remove('display-none');}
                
                // make the fields small again.
                for(var i = 1 ; i < expandedCoupon.children.length ; i++) { expandedCoupon.children[i].classList.remove('field--goingBig'); }
                
                // make the fields numbers disappear again
                for(var i = 0 ; i < selectedElementIs.allNumbersOfFields.length ; i++) {selectedElementIs.allNumbersOfFields[i].classList.remove('show');}
                
                // hide the number of the just closed coupon. it is the last child of the first element of that coupon.
                expandedCoupon.firstElementChild.lastElementChild.classList.add('hide');
            })();

            /////// 3) make the wrapper big.
            setTimeout(function(){ selectedElementIs.couponsWrapper.classList.remove('shrink-couponsWrapper');}, main_transition_duration); //you need to wait a lil bit.
        },

        //it takes an object . where u find all the filled and saved coupons
        exposeNextCoupon: function(allSavedCoupons){
            var targetCpn;
            // if there are filled Coupons , we show the we expose the (last-saved + 1) tiny coupon
            if(Object.keys(allSavedCoupons).length !== 0) {
                var allSavedCouponsArrayOfStrings = Object.keys(allSavedCoupons); 
                var lastSavedCouponId = allSavedCouponsArrayOfStrings[allSavedCouponsArrayOfStrings.length -1];
                for(var i = 0 ; i < selectedElementIs.allCoupons.length ; i++) {
                    if(selectedElementIs.allCoupons[i].id === lastSavedCouponId) { targetCpn = selectedElementIs.allCoupons[i+1]; }
                }

                //we expose the next tiny coupon and make it clickable
                this.showFieldsOfOneCoupon(targetCpn);
                this.CouponClickable(targetCpn.id);
                this.showDeleteAllButton();
            }
        },
  
        // this function we pass the coupon that we wanna fill as argument.
        fillRandomly: function(couponChosen) { 
            var targetCoupon;
            // if it is called without an argument , then we fill the expanded Coupon.
            if(typeof couponChosen === "undefined") { targetCoupon = this.getExpandedCoupon(); }
            else { targetCoupon = couponChosen; }

            var allCurrentFields = targetCoupon.children; // NodeList of all the fields of the target coupon.

            for(var j = 0 ; j < 2000 ; j++) {   // we keep looping repeatidly till we get 4 checked fields. (2000 iterations is more than enough to accomplish that)
                var alreadyCheckedFields = this.getCheckedFields(targetCoupon);  // array of the numbers of checked fields.
                
                if(alreadyCheckedFields.length === 4) { return; } // if we already checked 4 fields. Job is done, so exit the function.
                    
                var randNum = Math.floor(Math.random() * 25) + 1;  // pick w random number between 1 and 25.

                // we check if the recently generated randNum has already been picked before and saved or not. if not : we add the cross to the field.
                if(alreadyCheckedFields.includes(randNum) === false) { this.addCross(allCurrentFields[randNum]); }
            }
        },
        
        // add a cross to the passed argument, which is a field. by inserting a HTML element <img> as a first child of that field.
        addCross: function(elementClicked) {
            //we insert the element. it starts hidden. and then immediately afterwards we make it visible with animation.
            var html = '<img class="field__cross" src="img/cross.svg">';
            elementClicked.insertAdjacentHTML('afterbegin', html);
            setTimeout(function(){ elementClicked.firstElementChild.classList.add('show-cross'); }, 25); //you need to wait a lil bit. till the HTML insertion is done.
        },

        // remove the cross from the passed argument, which is a field. by removing a HTML element <img> , which is the first child of that field.
        removeCross: function(elementClicked){
            var crossTransition = main_transition_duration;
            elementClicked.firstElementChild.classList.remove('show-cross');  // first we make it disappear , for animation purposes.
            setTimeout(function(){ elementClicked.firstElementChild.remove(); }, crossTransition); // then finally we remove the HTML node. crossTransition : must be as long as the transition takes !
        },

        // it makes  the doneFillingButton active. 
        activateDoneFillingBtn: function() {
            selectedElementIs.doneFillingButton.classList.add('doneFillingBtn--activated');
        },

        // it makes  the doneFillingButton inactive. 
        deactivateDoneFillingBtn: function() {
            selectedElementIs.doneFillingButton.classList.remove('doneFillingBtn--activated');
        },

        //it is called in state 1, to expose one coupon. In other words hides the couponNumber AND shows the fields in their tiny form.
        showFieldsOfOneCoupon: function(targetCpn) {
            var allKidsOfCoupon = targetCpn.children;
            for(j = 1 ; j < allKidsOfCoupon.length ; j++) {  allKidsOfCoupon[j].classList.remove('hide'); }
            // hideNumberOfOneCoupon(targetCpn.id); // do we even need this function ???
            this.hideNumOfCoupon(targetCpn);
        },
       
        // it displays the nextCouponButton in the UI.
        showNextCouponButton: function() {
            // selectedElementIs.nextCouponButton.classList.add('show');
            selectedElementIs.nextCouponButton.classList.add('show-nextCouponButton');
        },

        // it hides the nextCouponButton in the UI.
        hideNextCouponButton: function() {
            selectedElementIs.nextCouponButton.classList.remove('show-nextCouponButton');
            // selectedElementIs.nextCouponButton.classList.remove('show');
        },

        // it displays the goBackButton in the UI.
        showGobackButton: function() {
            selectedElementIs.goBackButton.classList.add('show');
        },

        // it hides the goBackButton in the UI.
        hideGobackButton: function() {
            selectedElementIs.goBackButton.classList.remove('show');
        },

        // it displays the deleteAllButton in the UI.
        showDeleteAllButton: function() {
            selectedElementIs.deleteAllButton.classList.add('show-deleteAllButton');
        },

        // it hides the deleteAllButton in the UI.
        hideDeleteAllButton: function() {
            selectedElementIs.deleteAllButton.classList.remove('show-deleteAllButton');
        },

        // toggle between two Labels, of the same button |  the Delete button , has different label in different states of the program.
        changeNameOfDeleteAllBtn: function() {
            var deleteAllCouponsStr = 'Clear All Coupons';
            var deleteAllFieldsStr = 'Clear All Fields' ;
            var target = selectedElementIs.deleteAllButton.lastElementChild; // lastElement is the span tag where text is stored.

            // we basically toggle between two Labels. of the same button
            if(target.textContent === deleteAllCouponsStr)      { target.textContent = deleteAllFieldsStr ;}
            else if(target.textContent === deleteAllFieldsStr)  { target.textContent = deleteAllCouponsStr;}
        },

        // it hides the number of a the coupon , that passed as argument.
        hideNumOfCoupon: function(targetCpn){
            var temp = targetCpn.id;
            var targetIndex = parseInt(temp[temp.length-1]); //the last charachter in the id. is the index.

            // it targets the right number , based on the index. (targetIndex-1 : because the ids of the coupons start from 1, whereas the allNumbersOfCoupons start from 0. )
            selectedElementIs.allNumbersOfCoupons[targetIndex-1].classList.add('hide'); 
        },

        // Make all filled/saved coupons clickable. This method will be called by : goback button | deleteAllcoupons button | all randomlyFill buttons
        makeAllFilledCouponsClickable: function(allSavedCoupons){
            var allCouponsArrayOfStrings = Object.keys(allSavedCoupons);
            //we pass the key of a coupon , because it is exactly the same as the id of HTML element coupon.
            for(var i = 0 ; i < allCouponsArrayOfStrings.length ; i++) {  this.CouponClickable(allCouponsArrayOfStrings[i]); }
        },

        // make only one specific coupon clickable.
        CouponClickable: function(nextCouponId) {
            if(typeof nextCouponId !== "undefined") {   //if it is called with an argument.
                document.getElementById(nextCouponId).classList.remove('block-interaction');
                document.getElementById(nextCouponId).classList.add('release-interaction');
            }
            else {  //otherwise , make the expanded coupon clickable.
                (this.getExpandedCoupon()).classList.remove('block-interaction');
                (this.getExpandedCoupon()).classList.add('release-interaction');
            }
        },

        // make only one specific coupon unclickable.
        CouponUnclickable: function(nextCouponId) {
            if(typeof nextCouponId !== "undefined") {  //if it is called with an argument.
                document.getElementById(nextCouponId).classList.remove('release-interaction');
                document.getElementById(nextCouponId).classList.add('block-interaction');
            }
            else { //otherwise , make the expanded coupon unclickable
                (this.getExpandedCoupon()).classList.remove('release-interaction');
                (this.getExpandedCoupon()).classList.add('block-interaction');
            }
            
        },

        // it makes all the not-checked fields ,of the expanded coupon, unclickable.
        fieldsUnclickable: function(){
            var allFields = (this.getExpandedCoupon()).children;  // we get all the fields of the expanded coupon.
            for(var i = 1 ; i < allFields.length ; i++) { // iterate from 1 , because the firstl HTML element in the coupon is NOT a field.
                // it blocks only the fields that has one element. which means not-checked fields.
                if(allFields[i].childElementCount == 1) {  allFields[i].classList.add('block-interaction'); }
            }
        },

        // it makes all the not-checked fields ,of the expanded coupon, clickable.
        fieldsClickable: function(){
            var allFields = (this.getExpandedCoupon()).children;  // we get all the fields of the expanded coupon.
            for(var i = 1 ; i < allFields.length ; i++) { // iterate from 1 , because the firstl HTML element in the coupon is NOT a field.
                // it blocks only the fields that has one element. which means not-checked fields.
                if(allFields[i].childElementCount == 1) {  allFields[i].classList.remove('block-interaction'); }
            }
        },

        // delete all the ckecked fields in the expanded coupon.
        deleteAllFieldsInOneCoupon: function(){
            expandedCoupon = this.getExpandedCoupon();
            var allFields = expandedCoupon.children;
            var crossTransition = 300;
            function temp(i){  setTimeout(function(){ allFields[i].firstElementChild.remove(); } , crossTransition); } // function to remove the cross , with animation.

            for(var i = 1 ; i < allFields.length ; i++){  // iteration starts from 1 because the first element of the coupon is NOT a field.
                if(allFields[i].childElementCount == 2) {  // if a field is checked
                    allFields[i].firstElementChild.classList.remove('show-cross');
                    temp(i); // we did it like this, because two timer-handler functions MUST NOT share the same i. one of them should just make a copy for itself and use it.
                }
            }
        },

        //it takes a float number and a parameter ( 1 or -1)
        // we  call calculate ONLY when we add or remove an item. in all other cases : we just use the value found in TotalCost , and we decide whether we increment it or decrement it.
        // we call it with a paramater if we wanna add the price of one coupon to it. In case , the expandedCoupon is not saved yet.
        displayTotal: function(costs,option) {
            var PriceToDisplay;
            if(typeof option !== "undefined") {  // if option is defined we extract the final price to display . from thee UI itself. Otherwise from data structure.
                (function(){
                    var currentPrice = getPrice();
                    var ArrayOfStr = currentPrice.split(',');
                    var decimalStr = parseInt(ArrayOfStr[0]);
                    var fractionStr = parseInt(ArrayOfStr[1]);
                    var newCurrentPriceStr = decimalStr + '.' + fractionStr;
                    var newCurrentPriceFloat = parseFloat(newCurrentPriceStr); //here we have the current price as a float.
    
                    if(option === 1)  { PriceToDisplay = newCurrentPriceFloat + oneCouponPrice; }
                    if(option === -1) { PriceToDisplay = newCurrentPriceFloat - oneCouponPrice; }
                })(option);
            }
            else { PriceToDisplay = costs; }

                var costsString = (PriceToDisplay.toFixed(2)).toString();
                var ArrayOfStr = costsString.split('.');
                var decimal = ArrayOfStr[0];
                var fraction = ArrayOfStr[1];
                var fractionToDisplay= fraction;
    
                if(fraction.length === 1) { fractionToDisplay = fraction + '0';}
            
            selectedElementIs.price.textContent = decimal + ',' + fractionToDisplay + ' €';
        }
    }

})();




// ######################################################################################################################
//  GLOBAL APP CONTROLLER ###############################################################################################
var controller = (function(jackpotCtrl , UICtrl) {
    // each time we open a coupon, we check if it is filled or not. if filled : checkedfields = 4 else = 0.
    // because this variable is directly responsible for decidin whether to save a coupon or not. 
    var checkedFields = 0 ; 
    const oneCouponPrice = 1.2;
    /*  this is flag is created just for the deleteAllFields button when it calls updateTotal() upon click.
     if we dont use this flag , each time the button is clicked, it will call updateTotal() and keep decrementin the total on the UI !
      1 : you are allowed to decrement it. | -1 : you are NOT allowed to decrement it. */
    var decrementTotalFlag = 0; 
    var addNewCouponFlag = 0; // 1 : yes => please do it. |  : 0 => no god no. dont !
    var selectedElementIs = UICtrl.getSelectedElementIs();
    var DOMStrings = UICtrl.getDOMStrings();   // class or id of elements as a string.
    
    
    setupEventListeners = function() {
        // when we click the info Button. the info popup appears.
        selectedElementIs.infoButton.addEventListener('click' , CtrlOpenPopupOrFillRandomly);

        selectedElementIs.couponsWrapper.addEventListener('click', CtrlExpandCoupon);

        selectedElementIs.goBackButton.addEventListener('click', CtrlShrinkCoupon);

        selectedElementIs.couponsWrapper.addEventListener('click', CtrlToggleCross); 

        selectedElementIs.deleteAllButton.addEventListener('click', CtrlDelete);

        selectedElementIs.nextCouponButton.addEventListener('click', CtrlGoToNextCoupon);

        //it whether open a popup or fill the expanded coupon randomly. depenedin on the state we are in.
        selectedElementIs.quickTips.addEventListener('click', CtrlOpenPopupOrFillRandomly);

        selectedElementIs.allPopupsContainer.addEventListener('click', CtrlClosePopup);

        // listen to the UI of randomButtons
        selectedElementIs.chooseRandomNumPopup.addEventListener('click', CtrlChooseRandomNum);

        // listen to the UI of astroPopup
        selectedElementIs.astroPopup.addEventListener('click', CtrlAstroPopup);

        // listen to the UI of Statistics popup
        selectedElementIs.statisticPopup.addEventListener('click', CtrlStatisticPopup);

        
        // selectedElementIs.RandomButton.addEventListener('click' , CtrlParentRandomButton)
    };

    //it takes care of buttons functionalities inside the Statistic Popup
    function CtrlStatisticPopup() {
        clickedElement = event.target;
        clickedElementId = clickedElement.id;

        //if one of the statistic paragraphs are clicked ,inside of the StatistikPopup, is clicked then we open the FillRandomlyPopup
        if(clickedElement.classList.contains(DOMStrings.statisticButton)) {
            UICtrl.closePopup();
            setTimeout(function(){ UICtrl.openFillRandomlyPopup();}, 200); //you need to wait till the previous popup is closed.
        }
    }

    //it takes care of buttons functionalities inside the Astro Popup
    function CtrlAstroPopup() {
        clickedElement = event.target;
        clickedElementId = clickedElement.id;

        //if one of the astro buttons ,inside of the AstroPopup, is clicked then we open the FillRandomlyPopup
        if(clickedElement.classList.contains(DOMStrings.astroButton)) {  
            UICtrl.closePopup(); 
            setTimeout(function(){ UICtrl.openFillRandomlyPopup();}, 100); 
        }

    }

    // this function is called when we click on +1 / +3 / +6 or fill all coupons randomly buttons.
    function CtrlChooseRandomNum(){
            var clickedElementId, counterStr, counter ,targetCoupon , allCoupons;
            clickedElementId = event.target.id;
            allCoupons = selectedElementIs.allCoupons;

            // check whether we clicked on fillAllCouponsButton or on one of the other FillrandomButton
            if(clickedElementId === selectedElementIs.fillAllCouponsButton.id) { counter = allCoupons.length; }
            else if(clickedElementId.includes('Fields')) {
                counterStr = clickedElementId[0]; // extract from the id, how many coupons we wanna fill.
                counter = parseInt(counterStr);    // we make the extracted number and Interger.
            }

            //this is the main-part . go through with the function ONLY IF the counter is defined
            if(typeof counter !== "undefined") {
                for(var i = 0 ; i < allCoupons.length ; i++) {   // we loop through all coupons from first to the nineth coupon.
                    if(jackpotCtrl.hasCoupon(allCoupons[i].id) === 0) { // if the coupon is NOT saved yet. then fill it randomly.
                        targetCoupon = allCoupons[i];
                        UICtrl.fillRandomly(targetCoupon);

                        // show it , by hidin the number of coupon, and showing the lil fields
                        UICtrl.hideNumOfCoupon(targetCoupon); // it hides the numbers up until the last filled coupon.
                        UICtrl.showFieldsOfOneCoupon(targetCoupon);

                        //we add the new coupon to the data structure
                        CtrlAddNewCoupon(targetCoupon); 

                        counter--;  // keeping track of how many coupons to fill randomly.
                    }
                    if(counter === 0) { break;}  // we get out of the loop once the chosen number coupons to fill , is reached.
                }

                CtrlClosePopup();
                updateTotal();
                UICtrl.showDeleteAllButton();
                UICtrl.exposeNextCoupon(jackpotCtrl.getAllCoupons());
                UICtrl.activateDoneFillingBtn();
            }
    }

    // it closes the currently openend popup
    function CtrlClosePopup() {
        UICtrl.closePopup();
        UICtrl.makeAllFilledCouponsClickable(jackpotCtrl.getAllCoupons());
    }

    // this method . whether it opens a popup (the fillRandomly popups OR the Info popup), OR it fill the expandedCoupon randomly.
    // this is because the clicked buttons , have different functionality in different states. 
    function CtrlOpenPopupOrFillRandomly(){
        var clickedElement = event.target;
        //1) if we are in the state_1 , do the following :  ##############################################
        //if there is no expanded coupon. we are in state 1
        if(typeof (UICtrl.getExpandedCoupon()) === "undefined") { UICtrl.openPopup(); }

        // 2) otherwise we are in state_2 , and do different stuff #########################################
        else {
            //if one of the fillRandomly Buttons clicked. we fill randomly
            if(  clickedElement === selectedElementIs.randomButton 
              || clickedElement === selectedElementIs.astroButton
              || clickedElement === selectedElementIs.statisticButton ) {
                UICtrl.fillRandomly(); //we fill the coupon without opening the popUp
                updateTotal(1);
                decrementTotalFlag = 1; // now we are allowed to decrement the total but clicking the deletAllfields button.
                checkedFields = 4;  
                addNewCouponFlag = 1;  //we release the flag whenever all required fields are checked.
                //we show the next coupon button . as long as we are not already in the last coupon. (nineth one)
                if(Object.keys(jackpotCtrl.getAllCoupons()).length < 8) { UICtrl.showNextCouponButton(); } 
                UICtrl.showDeleteAllButton();
                UICtrl.activateDoneFillingBtn();
            }
            //if the info button is clicked . we open the info popup
            else if((clickedElement.id).includes('info')) { UICtrl.openPopup(); } 
        }
    }

    // this is a helping function. its is not called directly from any event listener
    // It saved a coupon to the data structure.
    function CtrlAddNewCoupon(couponToAdd){
        var targetCoupon , targetCouponId , pickedFields;
        //if we call it without an argument. we add the currently expanded coupon.
        if(typeof couponToAdd === "undefined") { targetCoupon = UICtrl.getExpandedCoupon(); }
        else { targetCoupon = couponToAdd; }

        targetCouponId = targetCoupon.id;
    
       pickedFields = UICtrl.getCheckedFields(targetCoupon);
       jackpotCtrl.addCoupon(pickedFields,targetCouponId);  // it saves the new coupon in the data structure. Coupon id is the same as the key of the coupon in the data structure.
    }

    // it takes the needed steps to open the next coupon.
    function openNextCoupon(nextCouponId) { 
        UICtrl.expandCoupon(nextCouponId);
        UICtrl.CouponUnclickable();
        UICtrl.showGobackButton();
        UICtrl.hideDeleteAllButton();
    }

    // it takes all the needed steps to expand the clicked  coupon.
    function CtrlExpandCoupon() {
        var cpnClickedId;
        if(event.target.classList.contains('coupon')){ // check if the clicked element is indeed a coupon.
            cpnClickedId = event.target.id;
            UICtrl.expandCoupon(cpnClickedId);

            //decide what value we give to checkedFields
            if(jackpotCtrl.hasCoupon(cpnClickedId)){ checkedFields = 4; UICtrl.showNextCouponButton(); decrementTotalFlag = 1;} // if the coupon is saved. then it is already filled.
            else { checkedFields = 0; UICtrl.fieldsClickable(); }   //if the coupon is not filled, we make the fields clickable. so we can check them.           
            UICtrl.CouponUnclickable();  //Either way , whenever we expand a coupon. we always make the coupon unclickable.
            
            //show and hide buttons
            UICtrl.showGobackButton();
            UICtrl.changeNameOfDeleteAllBtn(); // changes from deleting the coupons , to deleting the fields of the expanded coupon.
        }
    }

    // it takes all the needed steps to shrink a coupon and go back to overview UI
    function CtrlShrinkCoupon() {
        // we allowed to go back . only if the coupon is fully filled , or completely emtpy.
        if(checkedFields === 4 || checkedFields === 0 ) {
            if(checkedFields === 4) { if(addNewCouponFlag) { CtrlAddNewCoupon(); addNewCouponFlag = 0; } } // if addNewCouponFlag is released, then we save the new coupon.
            // if the user unchecked all the fields , then we (try to) delete that coupon from the data structure.
            if(checkedFields === 0) { jackpotCtrl.removeCoupon((UICtrl.getExpandedCoupon()).id); UICtrl.CouponClickable(); } //

            UICtrl.makeAllFilledCouponsClickable(jackpotCtrl.getAllCoupons());
            UICtrl.shrinkCoupon();
            UICtrl.hideNextCouponButton();
            UICtrl.hideGobackButton();
            updateTotal();

            //dont change name , when we click on nextCouponButton
            if(event.target !== selectedElementIs.nextCouponButton) { UICtrl.changeNameOfDeleteAllBtn(); }
            UICtrl.exposeNextCoupon(jackpotCtrl.getAllCoupons()); // expose the next empty coupon in state 1. so we can click , expand it and fill it.
            
            //we activate DoneFilling button , only if there are saved coupons. otherwise deactivate and dispaly initialUI
            if(Object.keys(jackpotCtrl.getAllCoupons()).length > 0) { UICtrl.activateDoneFillingBtn(); } // if there are any saved coupons . activate DoneFillingBtn
            else { UICtrl.deactivateDoneFillingBtn(); UICtrl.setInitialUI(); } 
            
        }
        else { alert('In order to be able to submit the coupon, it must be completed or completely cleared.'); } 
    }

    // it whether adds or removes the cross from the clicked field.
    function CtrlToggleCross() {
        var elementClicked ;
        elementClicked = event.target;

        if(elementClicked.classList.contains('field--goingBig')){ // we make sure first, that clicked element is indeed a field.
           
            //  This is Adding #############################################
            if(elementClicked.childElementCount == 1) { // if there is no cross element in the HTML . we gonna add one.
                if(checkedFields < 4) { UICtrl.addCross(elementClicked); checkedFields++;}
                if(checkedFields === 4) {
                    //we show the nextCouponButton as long as wei not in the last coupon already.
                    if(Object.keys(jackpotCtrl.getAllCoupons()).length < 8) { UICtrl.showNextCouponButton(); } 
                    addNewCouponFlag = 1 ;      // permission flag. . => yes do it 
                    UICtrl.fieldsUnclickable();  //block all the empty fields.
                    updateTotal(1); //we increase the amount displayed in the UI
                    decrementTotalFlag = 1;
                }

                // we de-activate the DoneFillingBtn based on the value of checkedFields.  
                if(checkedFields === 0 || checkedFields === 4) { UICtrl.activateDoneFillingBtn(); } else { UICtrl.deactivateDoneFillingBtn(); }
                UICtrl.showDeleteAllButton();
            }

            //  This is removing #############################################
            else if(elementClicked.childElementCount == 2){ // if there is a cross element in the HTML . we gonna remove one.
                UICtrl.removeCross(elementClicked);
                checkedFields--;
                //we make them clickable again , only when ( => max-number-of-checked-fields - 1)
                if(checkedFields === (4-1)) {
                    updateTotal(-1); ////we decrease the amount displayed in the UI
                    decrementTotalFlag = 0;
                    UICtrl.fieldsClickable();  //we only need to call function ONCE. the one time when we uncheck the first field from a fully checked coupon.
                } 
                addNewCouponFlag = 0; // permission denied.
                // UICtrl.fieldsClickable();  
                UICtrl.hideNextCouponButton();
                

                // we de-activate the DoneFillingBtn based on the value of checkedFields.  
                if(checkedFields === 0 ) { UICtrl.activateDoneFillingBtn(); UICtrl.hideDeleteAllButton(); }  else { UICtrl.deactivateDoneFillingBtn(); }
            }

        }
    }

    // we  call calculate ONLY when we add or remove an item. in all other cases : we just use the value found in TotalCost , and we decide whether we increment it or decrement it.
    // we call it with a paramater if we wanna add the price of one coupon to it. In case , the expandedCoupon is not saved yet.
    function updateTotal(option){  // 1 => +1 couponPrice | -1 => -1 couponprice
        if(typeof option === "undefined") { jackpotCtrl.calculateTotal(); } // we calculate the total only when needed.
        var total = jackpotCtrl.getTotal();
        UICtrl.displayTotal(total,option);
    }

    // it takes us to the next coupon. to fill it or to modify it. it shrinks the coupon first, then it expands the next one. (for animation purposes)
    function CtrlGoToNextCoupon() {
        var nextCouponId , nextCoupon;
        //we get the id of the current coupon. so we can determine the next coupon.
        nextCoupon = UICtrl.getExpandedCoupon().nextElementSibling;
        nextCouponId = nextCoupon.id;
        
        CtrlShrinkCoupon();
        openNextCoupon(nextCouponId);
        updateTotal();

        if(jackpotCtrl.hasCoupon(nextCouponId)){
            checkedFields = 4;
            UICtrl.showNextCouponButton();
            UICtrl.showDeleteAllButton(); // we wanna be albe to uncheck all the fields , if there are checked.
        } 
        else { checkedFields = 0; UICtrl.fieldsClickable(); }
    }

    // this is a helping function. it is called by CtrlDelete . It take the needed steps to delete all Fields in the expanded coupon.
    function CtrlDeleteAllFieldsInOneCoupon(){
        addNewCouponFlag = 0; // we are not allowed to add new coupon
        UICtrl.deleteAllFieldsInOneCoupon();
        UICtrl.fieldsClickable();
        UICtrl.hideNextCouponButton();
        // jackpotCtrl.removeCoupon((UICtrl.getExpandedCoupon()).id);  //we shoulnd call it here. ! instead , it should be called when click goBack button. in that way we are 100% sure the user wanted to delete
        checkedFields = 0;
    };

    // whether it deletes all saved coupons. OR all fields of the expanded coupon. based on the state we are it.
    function CtrlDelete() {
        //in case we are in state 1 . we simply delete all filled coupons.
        if(typeof UICtrl.getExpandedCoupon() === "undefined") { //if there is no expanded coupon then we are in state 1.
            jackpotCtrl.deleteAllCoupons();
            UICtrl.makeAllFilledCouponsClickable(jackpotCtrl.getAllCoupons());
            UICtrl.deactivateDoneFillingBtn()
            UICtrl.setInitialUI(); 
            updateTotal();   
        }

        // in case we are in state 2 . we delete all fields.
         else { 
            CtrlDeleteAllFieldsInOneCoupon();
            if(decrementTotalFlag) {  updateTotal(-1); decrementTotalFlag = 0;  } //we can update the total , only if the flag is released.
        } 

         UICtrl.hideDeleteAllButton();
    }

    return {
        init: function() {
            UICtrl.setInitialUI();
            setupEventListeners();
        }
    }

})(JackpotController,UIController);


controller.init();



/* 
document.querySelector('html').addEventListener('click' , function(){
    console.log('the clicked element is : ');
    console.log(event.target);
})
 */  