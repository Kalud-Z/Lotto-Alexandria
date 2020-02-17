


// #########################################################################################################################
// BUDGET CONTROLLER ########################################################################################################
var JackpotController = (function() {

    var AllFilledCoupons = {};

    var Coupon = function(num) {
        // this.id = id;
        this.numbersPicked = num;
    };

    function createCoupon(num) { return new Coupon(num); }

    return {
        addCoupon: function(num,name) {
            AllFilledCoupons[name] = createCoupon(num); 
            console.log(AllFilledCoupons);
        },

        removeCoupon: function(id) {
            //check if it exits first
            if(this.hasCoupon(id)) {
                delete AllFilledCoupons[id]; // delete element from an object based on the key.
                console.log('we just deleted an item from the allCoupons object');
                console.log(AllFilledCoupons);
            }
            
        },

        deleteAllCoupons: function(){
            for(var member in AllFilledCoupons) delete AllFilledCoupons[member]; // nice way to loop through all elements.
            console.log(AllFilledCoupons);
        },

        //checks if the coupon exists in the allcoupons object .return 1 if yes it has it.
        hasCoupon: function(id) {
            var temp = 0;
            var keysOfCouponsFilled = Object.keys(AllFilledCoupons); // return an array with the keys as elements (as strings)
            for(var i = 0 ; i < keysOfCouponsFilled.length ; i++){
                if(keysOfCouponsFilled[i] === id) { temp = 1 ;}
            }
            return temp;
        },

        getAllCoupons: function() {
            return AllFilledCoupons;
        }
    }

})();




// ######################################################################################################################
// UI ####################################################################################################################
var UIController = (function() {
    var expandedCouponID;
    var expandedCoupon;

    var main_transition_duration = 190;  //just lil bit longer than the transition to make sure , everything goes fines. x * 1.1


    var selectedElementIs = {
        couponsWrapper : document.querySelector('.coupons-wrapper'),
        allCoupons : document.querySelectorAll('.coupon'),
        couponsTitle: document.querySelectorAll('.coupon__title'),
        allNumbersOfCoupons : document.querySelectorAll('.coupon__number'),

        allFields : document.querySelectorAll('.field'),    
        allNumbersOfFields : document.querySelectorAll('.field__number'),

        deleteButton : document.querySelector('.delete'),
        goBackButton : document.querySelector('.goback'),
        deleteAllButton: document.querySelector('.deleteAll'),
        nextCouponButton: document.querySelector('.nextCoupon'),
        doneFillingButton: document.querySelector('.doneFillingBtn'),
        


        quickTips: document.querySelector('.quickTips'),

        randomButton: document.querySelector('#quickTipsItemRandomButton'),
        astroButton: document.querySelector('#quickTipsItemAstroButton'),
        statisticButton: document.querySelector('#quickTipsItemStatisticButton'),

        oneField: document.getElementById('#1-Fields'),
        threeFields: document.getElementById('#3-Fields'),
        sixFields: document.getElementById('#6-Fields'),
        fillAllCouponsButton: document.getElementById('fillAllCouponsBtn'),
        chooseRandomNumPopup:document.querySelector('#popupRandomButton'),

        astroPopup: document.getElementById('popupAstroButton'),        
        allAstroButtons: document.querySelectorAll('.randomNumbers-popup__button--astro'),
    
        statisticPopup: document.getElementById('popupStatisticButton'),

        allPopups: document.querySelectorAll('.randomNumbers-popup'),
        closePopupIcon: document.querySelector('.randomNumbers-popup__cancel-logo') 
        


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

    function allExceptTheFirstCouponUnclickable(){
        var allCoupons = selectedElementIs.allCoupons;
        for(var i = 1 ; i < allCoupons.length ; i++) {
            allCoupons[i].classList.remove('release-interaction');
            allCoupons[i].classList.add('block-interaction');
        }
    }


    function showDeleteButton() {
        selectedElementIs.deleteButton.classList.add('show');
    }

    function hideDeleteButton() { 
        selectedElementIs.deleteButton.classList.remove('show');
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

    function showNumbersOfallCoupons() {
        for(var i = 0 ; i < selectedElementIs.allNumbersOfCoupons.length ; i++) {
            selectedElementIs.allNumbersOfCoupons[i].classList.remove('hide');
        } 
    }

    function hideNumberOfOneCoupon(couponId) {
        var indexTemp , indexTempInt , targetIndex , targetNumber;

        indexTemp = couponId[couponId.length-1]
        indexTempInt = parseInt(indexTemp);
        targetIndex = indexTempInt - 1 ;
        targetNumber = selectedElementIs.allNumbersOfCoupons[targetIndex];
        targetNumber.classList.add('hide');
    }

    function hideAllFields() {
        // children of coupon (number + fileds) they start hidden. . then we toggle the class show
        for(var i = 1 ; i < selectedElementIs.allCoupons.length ; i++) {
            var allKidsOfCoupon = selectedElementIs.allCoupons[i].children;
            for(j = 1 ; j < allKidsOfCoupon.length ; j++) {  allKidsOfCoupon[j].classList.add('hide'); }
        }
    }

    function showTitle() {
        UIController.getExpandedCoupon().firstElementChild.firstElementChild.classList.add('show');  // this is how a private function , calls a public one of the same module.
    }

    function hideTitle() {
        UIController.getExpandedCoupon().firstElementChild.firstElementChild.classList.remove('show');
    }

    function displayCoupons() {
        var allCoupons = selectedElementIs.allCoupons;

        for(let i = 0 ; i < allCoupons.length ; i++) {
            //   allCoupons[i].classList.add('display-element');
            (function() {
                setTimeout(function(){
                    var allCoupons = selectedElementIs.allCoupons;
                    allCoupons[i].classList.add('show');
                } ,222 * i); //you need to wait a lil bit.
    
            })(i);
         }
    }

    return {
        openFillRandomlyPopup: function(){
            // console.log('openFillRandomlyPopup  is caleddddd ')
            selectedElementIs.chooseRandomNumPopup.classList.add('show');
            selectedElementIs.chooseRandomNumPopup.firstElementChild.classList.add('showPopup');
        },

        openPopup: function() {
            var elementClickedID;
            var elementClickedID = event.target.id;
            // console.log('this is the clicked element . im the openPopup : ' + elementClickedID);
            //extract the specific type of the popup , from the clicked item.
            var exactType =  elementClickedID.substring(13, elementClickedID.length);
        
            // we add that type to the second part of the id of the target popup
            var exactPopupID = 'popup' + exactType;
        
            document.getElementById(exactPopupID).classList.add('show');
            document.getElementById(exactPopupID).firstElementChild.classList.add('showPopup');
        },

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
                    if(selectedElementIs.allCoupons[i].classList.contains('coupon--big')){
                        return selectedElementIs.allCoupons[i];
                    }
                }
        },

        getSelectedElementIs: function() {
            return selectedElementIs;
        },

        getDOMStrings: function() {
            return DOMStrings;
        },

        //returns an array with the numbers of the checked fields. it takes the coupon
        getCheckedFields: function(couponToCheck){
            var targetCoupon;
            if(typeof couponToCheck === "undefined") {
                targetCoupon = this.getExpandedCoupon() ;
            } else { targetCoupon = couponToCheck; }

            var checkedFields = [];
            var allFields = targetCoupon.children; 
            for(var i = 1 ; i < allFields.length ; i++) {
                if(allFields[i].childElementCount == 2) { checkedFields.push(i); }
            }
            return checkedFields;
        },

        // return a coupon element . based on id
        getCoupon: function(couponId) {
            var allCoupons = selectedElementIs.allCoupons;
            for(var i = 0 ; i < allCoupons.length ; i++) {
                if( allCoupons[i].id === couponId) {
                    return allCoupons[i];
                }
            }
        },

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
                
                // setTimeout(function(){ selectedElementIs.couponsWrapper.classList.add('shrink-couponsWrapper');}, main_transition_duration); //you need to wait a lil bit.


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
                    for(var i = 0 ; i < selectedElementIs.allFields.length ; i++) {
                        selectedElementIs.allNumbersOfFields[i].classList.add('show');
                    }       
            
                    showDeleteButton();        
                    //we hide the number of that coupon
                    expandedCoupon.firstElementChild.lastElementChild.classList.add('hide');
                })();

                //////// 3) from the middle . the  already expanded coupon scales up in nice transition to 1. this done by returin the scale of wrapper back to 1.
                setTimeout(function(){ selectedElementIs.couponsWrapper.classList.remove('shrink-couponsWrapper');}, main_transition_duration); //you need to wait a lil bit.

                // setTimeout(function(){ showTitle(); }, main_transition_duration); //you need to wait a lil bit.
                showTitle();

            }
        },
        
        shrinkCoupon: function() { 
            expandedCoupon = this.getExpandedCoupon();
            hideTitle();
            
            //////// 1) the wrapper shrinks.
            selectedElementIs.couponsWrapper.classList.add('shrink-couponsWrapper');
            // setTimeout(function(){ selectedElementIs.couponsWrapper.classList.add('shrink-couponsWrapper');}, main_transition_duration); //you need to wait a lil bit.


            /////// 2) make the coupon small , and show it along the other coupons . aka the initial UI.
           (function schrinkCouponMain() {
                // console.log('inner schrib coupon is called hahahahaha');
                hideDeleteButton();
                
                //we make the opened coupons shrink. => to its initial state
                expandedCoupon.classList.remove('coupon--big');
            
                //we make all other coupons appear again. alongside with the previously opened one.
                for(var i = 0 ; i < selectedElementIs.allCoupons.length ; i++) {
                    selectedElementIs.allCoupons[i].classList.remove('display-none');
                }
                
                // make the fields small again.
                for(var i = 1 ; i < expandedCoupon.children.length ; i++) {
                    expandedCoupon.children[i].classList.remove('field--goingBig');
                }
                
                // make the fields numbers disappear again
                for(var i = 0 ; i < selectedElementIs.allNumbersOfFields.length ; i++) {
                    selectedElementIs.allNumbersOfFields[i].classList.remove('show');
                }
                
                // hide the number of the just closed coupon. it is the last child of the first element of that coupon.
                expandedCoupon.firstElementChild.lastElementChild.classList.add('hide');
            
            })();


            /////// 3) make the wrapper big.
            setTimeout(function(){ selectedElementIs.couponsWrapper.classList.remove('shrink-couponsWrapper');}, main_transition_duration); //you need to wait a lil bit.
        },

        //it takes an object . where u find all the filled and saved coupons
        exposeNextCoupon: function(allSavedCoupons){
            var targetCpn;
            // if there are filled Coupons , we show the showDeleteAllButton && we expose the next tiny coupon
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
            // console.log('thisi s the fillrandomly function : ');
            // console.log('this is is couponChosen : ' + couponChosen);
            if(typeof couponChosen === "undefined") {
                targetCoupon = this.getExpandedCoupon();
            } else { targetCoupon = couponChosen; }

            // console.log('this is target coupon : ' + targetCoupon);
            

            // console.log('thsi is coupon to fill ' + couponChosen);
            // var CouponToFill = couponChosen;
            // var keepGoing = 1;
            // var allCurrentFields = this.getExpandedCoupon().children;
            var allCurrentFields = targetCoupon.children;
            // var targetElement;
            for(var j = 0 ; j < 2000 ; j++) {
                var alreadyCheckedFields = this.getCheckedFields(targetCoupon);
                
                if(alreadyCheckedFields.length === 4) { return; }
                    
                var randNum = Math.floor(Math.random() * 25) + 1;

                if(alreadyCheckedFields.includes(randNum) === false) { this.addCross(allCurrentFields[randNum]); }
            }


        },
        
        addCross: function(elementClicked) {
            // console.log('addcross iscalled');
            // var html = '<object class="field__cross" type="image/svg+xml" data="img/cross.svg"></object>'; //causes some error !
            //we insert the element. it starts hidden. and then immediately afterwards we make visible with animation.
            var html = '<img class="field__cross" src="img/cross.svg">';
            elementClicked.insertAdjacentHTML('afterbegin', html);

            setTimeout(function(){ elementClicked.firstElementChild.classList.add('show-cross'); }, 25); //you need to wait a lil bit.
            // elementClicked.firstElementChild.classList.add('show');
        },

        removeCross: function(elementClicked){
            
            // var crossTransition = document.querySelector('.field__cross').style.transitionDuration;
            var crossTransition = main_transition_duration;
            elementClicked.firstElementChild.classList.remove('show-cross');
            setTimeout(function(){ elementClicked.firstElementChild.remove(); }, crossTransition); // you need for as long as the transition takes !
        },

        activateDoneFillingBtn: function() {
            selectedElementIs.doneFillingButton.classList.add('doneFillingBtn--activated');
        },

        deactivateDoneFillingBtn: function() {
            selectedElementIs.doneFillingButton.classList.remove('doneFillingBtn--activated');
        },


        showFieldsOfOneCoupon: function(targetCpn) {
            var allKidsOfCoupon = targetCpn.children;
            for(j = 1 ; j < allKidsOfCoupon.length ; j++) {  allKidsOfCoupon[j].classList.remove('hide'); }
            // console.log('ffffffffffffffffffffffffffffffffff ' + targetCpn.id);
            hideNumberOfOneCoupon(targetCpn.id);

        },
       
        showNextCouponButton: function() {
            selectedElementIs.nextCouponButton.classList.add('show');
        },

        hideNextCouponButton: function() {
            selectedElementIs.nextCouponButton.classList.remove('show');
        },

        showGobackButton: function() {
            // console.log('showGobackButton being called');
            selectedElementIs.goBackButton.classList.add('show');
        },

        hideGobackButton: function() {
            // console.log('hideGobackButton being called');
            selectedElementIs.goBackButton.classList.remove('show');
        },

        showDeleteAllButton: function() {
            selectedElementIs.deleteAllButton.classList.add('show');
        },

        hideDeleteAllButton: function() {
            selectedElementIs.deleteAllButton.classList.remove('show');
        },

        hideNumOfCoupon: function(targetCpn){
            var temp = targetCpn.id;
            var targetIndex = parseInt(temp[temp.length-1]);

            // console.log('thsis is ithe target index%%%%%%%%% ' + targetIndex);
            // console.log('thsis is the type ' + typeof targetIndex);
            selectedElementIs.allNumbersOfCoupons[targetIndex-1].classList.add('hide');
        },

        // this method will called by :  goback button | deleteAllcoupons button | all randomly fill buttons
        makeAllFilledCouponsClickable: function(allSavedCoupons){
            var allCouponsArrayOfStrings = Object.keys(allSavedCoupons);
            for(var i = 0 ; i < allCouponsArrayOfStrings.length ; i++) {
                this.CouponClickable(allCouponsArrayOfStrings[i]);
            }
        },

        CouponClickable: function(couponId) {
            if(typeof couponId !== "undefined") { 
                document.getElementById(couponId).classList.remove('block-interaction');
                document.getElementById(couponId).classList.add('release-interaction');
            }
            else {
                (this.getExpandedCoupon()).classList.remove('block-interaction');
                (this.getExpandedCoupon()).classList.add('release-interaction');
            }
            

        },

        CouponUnclickable: function(couponId) {
            if(typeof couponId !== "undefined") {
                document.getElementById(couponId).classList.add('block-interaction');
                document.getElementById(couponId).classList.remove('release-interaction');
            }
            else {
                (this.getExpandedCoupon()).classList.add('block-interaction');
                (this.getExpandedCoupon()).classList.remove('release-interaction');
            }
            
        },

        fieldsUnclickable: function(){
            // console.log('i am fieldsUnclickable and im caleld');
            var allFields = (this.getExpandedCoupon()).children; 
            for(var i = 1 ; i < allFields.length ; i++) {
                if(allFields[i].childElementCount == 1) { 
                    allFields[i].classList.add('block-interaction');
                }
            }
            // selectedElementIs.couponsWrapper.classList.add('block-interaction'); // i had to add this. otherwise the fileds would still be clickable !
        },

        fieldsClickable: function(){
            var allFields = (this.getExpandedCoupon()).children; 
            for(var i = 1 ; i < allFields.length ; i++) {
                if(allFields[i].childElementCount == 1) { 
                    allFields[i].classList.remove('block-interaction');
                }
            }
        },

        // delete all the ckecked fields in the currently opened coupon
        deleteAllFieldsInOneCoupon: function(){
            expandedCoupon = this.getExpandedCoupon();
            var kids = expandedCoupon.children;
            var crossTransition = 300;
            function temp(i) {  setTimeout(function(){ kids[i].firstElementChild.remove(); } , crossTransition); }

            for(var i = 1 ; i < kids.length ; i++){
                if(kids[i].childElementCount == 2) {
                    kids[i].firstElementChild.classList.remove('show-cross');
                    temp(i); // we did it like this, because two timer handler functions MUST NOT share the same i. one of them should just make a copy for itself and use it.
                }
            }
        }
        
    }


})();




// ######################################################################################################################
//  GLOBAL APP CONTROLLER ###############################################################################################
var controller = (function(jackpotCtrl , UICtrl) {
    // each time we open a coupon, we check if it is filled or not. if filled : checkedfields = 6 else = 0.
    // because this variable is directly responsible for submitting a legit coupon. 
    var checkedFields = 0 ;
    var addNewCouponFlag = 0; // 1 : yes => please do it. |  : 0 => no god no. dont !
    var selectedElementIs = UICtrl.getSelectedElementIs();
    var DOMStrings = UICtrl.getDOMStrings();
    
    
    setupEventListeners = function() {
        // var DOM = UICtrl.getDOMStrings();
        
        selectedElementIs.couponsWrapper.addEventListener('click', CtrlExpandCoupon);
        selectedElementIs.goBackButton.addEventListener('click', CtrlShrinkCoupon);

        selectedElementIs.couponsWrapper.addEventListener('click', CtrlToggleCross); 
        selectedElementIs.deleteButton.addEventListener('click', CtrlDeleteAllFieldsInOneCoupon);
        selectedElementIs.deleteAllButton.addEventListener('click', CtrlReset);

        selectedElementIs.nextCouponButton.addEventListener('click', CtrlGoToNextCoupon);

        //it whether open a popup or fill the expanded coupon randomly. depenedin on the state we are in.
        selectedElementIs.quickTips.addEventListener('click', CtrlOpenPopup);
        document.querySelector('body').addEventListener('click', CtrlClosePopup);

        // listen to the UI of randomButtons
        selectedElementIs.chooseRandomNumPopup.addEventListener('click', CtrlChooseRandomNum);

        // listen to the UI of astroPopup
        selectedElementIs.astroPopup.addEventListener('click', CtrlAstroPopup);

        // listen to the UI of Statistics popup
        selectedElementIs.statisticPopup.addEventListener('click', CtrlStatisticPopup);

        
        // selectedElementIs.RandomButton.addEventListener('click' , CtrlParentRandomButton)
    };

    function CtrlStatisticPopup() {
        clickedElement = event.target;
        clickedElementId = clickedElement.id;

        if(clickedElement.classList.contains(DOMStrings.statisticButton)) {
            UICtrl.closePopup();
            setTimeout(function(){ UICtrl.openFillRandomlyPopup();}, 200); //you need to wait a lil bit. 
        }
    }

    function CtrlAstroPopup() {
        clickedElement = event.target;
        clickedElementId = clickedElement.id;

        if(clickedElement.classList.contains(DOMStrings.astroButton)) {
            UICtrl.closePopup(); 
            setTimeout(function(){ UICtrl.openFillRandomlyPopup();}, 100); //you need to wait a lil bit. 
        }

    }

     function CtrlChooseRandomNum(){
            var clickedElementId, counterStr, counter , targetcoupn , allCoupons;
        
            clickedElementId = event.target.id;
            allCoupons = selectedElementIs.allCoupons;
            
            if(clickedElementId === selectedElementIs.fillAllCouponsButton.id) { counter = allCoupons.length; }
            else if(clickedElementId.includes('Fields')) {
                counterStr = clickedElementId[0];
                counter = parseInt(counterStr);
            }

            //go through with the function only if the counter is defined
            if(typeof counter !== "undefined") {
                for(var i = 0 ; i < allCoupons.length ; i++) {
                    if(jackpotCtrl.hasCoupon(allCoupons[i].id) === 0) {
                        targetCoupon = allCoupons[i];
                        UICtrl.fillRandomly(targetCoupon);

                        // show it , by hidin the number of coupon , and showing the lil fields
                        UICtrl.hideNumOfCoupon(targetCoupon);
                        UICtrl.showFieldsOfOneCoupon(targetCoupon);

                        //we add the new coupon
                        CtrlAddNewCoupon(targetCoupon); 

                        counter--;  // keeping track of how many coupons to fill randomly.
                    }
                    if(counter === 0) { break;}
                }

                //4)close the popup
                CtrlClosePopup();
                UICtrl.showDeleteAllButton();
                UICtrl.exposeNextCoupon(jackpotCtrl.getAllCoupons());
                UICtrl.activateDoneFillingBtn();
            }
    }

    function CtrlClosePopup() {
        UICtrl.closePopup();
        UICtrl.makeAllFilledCouponsClickable(jackpotCtrl.getAllCoupons());
    }

    function CtrlOpenPopup(){
        //1) if we are in the state_1 , do the following :
        if(typeof (UICtrl.getExpandedCoupon()) === "undefined") {
            // console.log('we are in state_1');
            UICtrl.openPopup();
        }

        // 2) otherwise we are in state_2 , and do different stuff
        else {
            //if the first button (RandomBtn) is clicked (the event flow for the first button is different from that of the other buttons.)
            if(event.target === selectedElementIs.randomButton 
              || event.target === selectedElementIs.astroButton
              || event.target === selectedElementIs.statisticButton ) {
                UICtrl.fillRandomly();
                addNewCouponFlag = 1;
                checkedFields = 4;  //we fill the coupon without opening the popUp
                //we show the next coupon button
                UICtrl.showNextCouponButton();
            } 
        }
    }

    // this is a helping function. its is not called directly from any event listener.
    //create name of the coupon U gonna add to the allCoupons object in the Jackpot module.
    function CtrlAddNewCoupon(couponToAdd){
        var targetCoupon;
        if(typeof couponToAdd === "undefined") {
            targetCoupon = UICtrl.getExpandedCoupon();
        }
        else { targetCoupon = couponToAdd; }

        // var newCouponName = couponToAdd.id;
        var targetCouponId = targetCoupon.id;
        //get checked fields
        // console.log('this is target couponnnnnn' + targetCoupon);
        // console.log(targetCoupon);
       var pickedFields = UICtrl.getCheckedFields(targetCoupon);
    //    console.log('these are the picked check fields ###### ' + pickedFields);
       jackpotCtrl.addCoupon(pickedFields,targetCouponId);
    }

    // it would way more efficient. if you have only one function to open a coupon. (you tried it , it didnt work because of the passed argument. U created it in way , if the argument if defined then use it. otherwise get the id from the clicked element.)
    function openNextCoupon(couponId) {  // you can make the other big expand coupon , use this one ad a helping function. it passes the target-coupon ID to it after it defines it.
        UICtrl.expandCoupon(couponId);
        if(jackpotCtrl.hasCoupon(couponId) === 1){ checkedFields = 4; UICtrl.showNextCouponButton(); } else { checkedFields = 0; UICtrl.fieldsClickable(); }
        // UICtrl.currentCouponUnclickable();
        UICtrl.CouponUnclickable();
        // console.log('just before showGobackButton');
        UICtrl.CouponUnclickable(couponId); // because we just turned it into clickable, as we called the schrinkCoupon method. in the same event handler
        UICtrl.showGobackButton();
        UICtrl.hideDeleteAllButton();
    }

    function CtrlExpandCoupon() {
        var cpnClickedId;
        if(event.target.classList.contains('coupon')){ 
            // UICtrl.showRandomButton();
            var cpnClickedId = event.target.id;
            UICtrl.expandCoupon(cpnClickedId);
            //decide what value we give to checkedFields
            // console.log('the id is ' + cpnClickedId);
            // console.log('rsult of hasCoupon ' + jackpotCtrl.hasCoupon(cpnClickedId));
            if(jackpotCtrl.hasCoupon(cpnClickedId) === 1){ checkedFields = 4; UICtrl.showNextCouponButton(); } else { checkedFields = 0; UICtrl.fieldsClickable(); }
            UICtrl.CouponUnclickable(); // because if you can click it between the fields . it will mess up the checkedFields variable. !
            //show and hide buttons
            UICtrl.showGobackButton();
            UICtrl.hideDeleteAllButton();
        }
        // console.log('CtrlExpandCoupon is called , and this the chckedfileds' + checkedFields);
     
    }

    function CtrlShrinkCoupon() {
        // we allowed to go back . only if the coupon is fully filled , or completely emtpy.
        if(checkedFields === 4 || checkedFields === 0 ) {
            UICtrl.makeAllFilledCouponsClickable(jackpotCtrl.getAllCoupons());
            if(addNewCouponFlag) { CtrlAddNewCoupon(); addNewCouponFlag = 0;}
            UICtrl.shrinkCoupon();
            UICtrl.hideNextCouponButton();
            UICtrl.hideGobackButton();
            UICtrl.exposeNextCoupon(jackpotCtrl.getAllCoupons());
            //we activate DoneFilling button , only if there are saved coupons. otherwise deactivate and dispaly initialUI
            if(Object.keys(jackpotCtrl.getAllCoupons()).length > 0) { UICtrl.activateDoneFillingBtn(); }
            else { UICtrl.deactivateDoneFillingBtn(); UICtrl.setInitialUI(); }

        }
        else { alert('Um den Schein abgeben zu können, muss dieser vervollständigt oder gelöscht werden.'); }

        if(checkedFields === 4) {
            if(addNewCouponFlag) { CtrlAddNewCoupon(); addNewCouponFlag = 0;}
        }
    }

    function CtrlToggleCross() {
        var elementClicked ;
        elementClicked = event.target;
        // console.log(elementClicked);


        if(elementClicked.classList.contains('field--goingBig')){
            if(elementClicked.childElementCount == 1)  {
        
                if(checkedFields < 4) {
                    UICtrl.addCross(elementClicked);
                    checkedFields++;
                }

                if(checkedFields === 4) {
                    UICtrl.showNextCouponButton();
                    addNewCouponFlag = 1 ; // permission flag. . => yes do it
                    //3)block all other fields and coupons.
                    UICtrl.fieldsUnclickable();
                }


            }
            else if(elementClicked.childElementCount == 2){
                console.log('child count is isssssssss ' + elementClicked.childElementCount)
                UICtrl.removeCross(elementClicked);
                checkedFields--;
                console.log('checkedFiled : '+ checkedFields);
                //we make them clickable again , only when ( => max-number-of-checked-fields - 1)
                if(checkedFields == (4-1)) { UICtrl.fieldsClickable(); }
                addNewCouponFlag = 0; // permission denied.
                UICtrl.fieldsClickable();
                UICtrl.hideNextCouponButton();
            }
        }
    }

    function CtrlDeleteAllFieldsInOneCoupon() {
        addNewCouponFlag = 0; // we are not allowed to add new coupon
        UICtrl.deleteAllFieldsInOneCoupon();
        UICtrl.fieldsClickable();
        UICtrl.hideNextCouponButton();
        jackpotCtrl.removeCoupon((UICtrl.getExpandedCoupon()).id);
        checkedFields = 0;
    }

    function CtrlGoToNextCoupon() {
        var couponId , nextCoupon;
        //we get the id of the current coupon. so we can determine the next coupon.
        nextCoupon = UICtrl.getExpandedCoupon().nextElementSibling;
        couponId = nextCoupon.id;
        
        CtrlShrinkCoupon();
        
        openNextCoupon(couponId);
        if(jackpotCtrl.hasCoupon(couponId) === 1){ checkedFields = 4; UICtrl.showNextCouponButton(); } else { checkedFields = 0; UICtrl.fieldsClickable(); }
        // console.log('CtrlGoToNextCoupon is called , and this the chckedfileds' + checkedFields);
        
    }


    function CtrlReset() {

        jackpotCtrl.deleteAllCoupons();
        UICtrl.makeAllFilledCouponsClickable(jackpotCtrl.getAllCoupons());
        UICtrl.hideDeleteAllButton();
        UICtrl.deactivateDoneFillingBtn()
        UICtrl.setInitialUI();
    }

    return {
        init: function() {
            UICtrl.setInitialUI();
            setupEventListeners();
        }
    }

})(JackpotController,UIController);


controller.init();



document.querySelector('html').addEventListener('click' , function(){
    console.log('the clicked element is : ');
    console.log(event.target);
})
 
