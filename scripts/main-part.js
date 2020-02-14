


// #########################################################################################################################
// BUDGET CONTROLLER ########################################################################################################
var JackpotController = (function() {

    var AllFilledCoupons = {};

    var Coupon = function(num) {
        // this.id = id;
        this.numbersPicked = num;
    };

    function createCoupon(num) { return new Coupon(num); }


   /*  var name = 'coupon-1';
    addCoupon(id,num,name);
    var name2 = 'coupon-2';
    addCoupon(id,num,name2);
 */


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

        //checks if the coupon exists in the allcoupons object
        hasCoupon: function(name) {
            var temp = 0;
            var keysOfCouponsFilled = Object.keys(AllFilledCoupons); // return an array with the keys as elements (as strings)
            for(var i = 0 ; i < keysOfCouponsFilled.length ; i++){
                if(keysOfCouponsFilled[i] === name) { temp = 1 ;}
            }
            return temp;
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
        allFields : document.querySelectorAll('.field'),    
        allNumbersOfFields : document.querySelectorAll('.field__number'),
        allNumbersOfCoupons : document.querySelectorAll('.coupon__number'),
        deleteButton : document.querySelector('.delete'),
        goBackButton : document.querySelector('.goback'),
        deleteAllButton: document.querySelector('.deleteAll'),
        nextCouponButton: document.querySelector('.nextCoupon'),
        fillRandomlyButton: document.querySelector('.random'),
        couponsTitle: document.querySelectorAll('.coupon__title'),
        // crossSymbol: document.querySelector

    };

    var DOMStrings = {
        couponsWrapper : '.coupons-wrapper',
        allCoupons : '.coupon',
        allFields : '.field',    
        allNumbersOfFields : '.field__number',
        allNumbersOfCoupons : '.coupon__number',
        deleteButton : '.delete',
        goBackButton : '.goback',
        deleteAllButton: '.deleteAll'
    };

    function showDeleteButton() {
        selectedElementIs.deleteButton.classList.add('show');
    }

    function hideDeleteButton() { 
        selectedElementIs.deleteButton.classList.remove('show');
    }

    function hideNextCouponButton() {
        selectedElementIs.nextCouponButton.classList.remove('show');
    }

    //delete all checked fields. basically a reset.
    function deleteAll() {
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

    function hideAllFields() {
        // children of coupon (number + fileds) they start hidden. . they we toggle the class show
        for(var i = 1 ; i < selectedElementIs.allCoupons.length ; i++) {
            var allKidsOfCoupon = selectedElementIs.allCoupons[i].children;
            for(j = 1 ; j < allKidsOfCoupon.length ; j++) {  allKidsOfCoupon[j].classList.add('hide'); }
        }
    }

    function showOnlyFirstCoupon(){
        var allCoupons = selectedElementIs.allCoupons;
        for(var i = 1 ; i < allCoupons.length ; i++) {
            // this.CouponUnclickable(allCoupons[i].id);
          document.getElementById(allCoupons[i].id).classList.add('block-interaction');
        }
    }

    function showTitle() {
        UIController.getExpandedCoupon().firstElementChild.firstElementChild.classList.add('show');  // this is how a private function , calls a public one of the same module.
    }

    function hideTitle() {
        UIController.getExpandedCoupon().firstElementChild.firstElementChild.classList.remove('show');
    }


    return {

        setInitialUI:function() {
            deleteAll()
            showNumbersOfallCoupons();
            hideAllFields();
            showOnlyFirstCoupon();
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

        //returns an array with the numbers of the checked fields
        getCheckedFields: function(){
            var checkedFields = [];
            var allFields = this.getExpandedCoupon().children; 
            // console.log(allFields);
            for(var i = 1 ; i < allFields.length ; i++) {
                if(allFields[i].childElementCount == 2) {
                    var number = allFields[i].innerText;
                    // console.log(number);
                    var temp = parseInt(number);
                    checkedFields.push(temp);
                }
            }
            return checkedFields;
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
           (function schrinkCoupon() {
                console.log('inner schrib coupon is called hahahahaha');
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
  
        fillRandomly: function() {
            var keepGoing = 1;
            var allCurrentFields = this.getExpandedCoupon().children;
            var targetElement;
            // while(keepGoing) {
                for(var j = 0 ; j < 2000 ; j++) {
                var alreadyCheckedFields = this.getCheckedFields();
                // console.log('alreadyCheckedFields : ' + alreadyCheckedFields.length);
                // console.log('keepHoing : ' + keepGoing);
                // if(alreadyCheckedFields === 6) { keepGoing = 0; }
                if(alreadyCheckedFields.length === 4) { return; }
                var randNum = Math.floor(Math.random() * 25) + 1;
                
                if(alreadyCheckedFields.includes(randNum) === false) {
                        this.addCross(allCurrentFields[randNum]);
                    }
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

        showRandomButton: function(){
            selectedElementIs.fillRandomlyButton.classList.add('show');
        },

        hideRandomButton: function(){
            selectedElementIs.fillRandomlyButton.classList.remove('show');
        },
       
        showNextCouponButton: function() {
            selectedElementIs.nextCouponButton.classList.add('show');
        },

        hideNextCouponButton: function() {
            selectedElementIs.nextCouponButton.classList.remove('show');
        },

        showGobackButton: function() {
            console.log('showGobackButton being called');
            selectedElementIs.goBackButton.classList.add('show');
        },

        hideGobackButton: function() {
            console.log('hideGobackButton being called');
            selectedElementIs.goBackButton.classList.remove('show');
        },

        showDeleteAllButton: function() {
            selectedElementIs.deleteAllButton.classList.add('show');
        },

        hideDeleteAllButton: function() {
            selectedElementIs.deleteAllButton.classList.remove('show');
        },

        CouponClickable: function(id) {
            console.log('CouponClickable is called');
            document.getElementById(id).classList.remove('block-interaction');
        },

        CouponUnclickable: function(id) {
            console.log('CouponClickable is called');
          document.getElementById(id).classList.add('block-interaction');
        },

        fieldsUnclickable: function(){
            console.log('i am fieldsUnclickable and im caleld');
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

        currentCouponUnclickable: function(){
            (this.getExpandedCoupon()).classList.add('block-interaction');
        },

        currentCouponClickable: function(){
            (this.getExpandedCoupon()).classList.remove('block-interaction');
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
      
        
      /*   reset: function(){
            //delete all checked boxed. basically a reset.
            setInitialUI();
            
        }, */
        
    }


})();




// ######################################################################################################################
//  GLOBAL APP CONTROLLER ###############################################################################################
var controller = (function(jackpotCtrl , UICtrl) {
    // each time we open a coupon, we check if it is filled or not. if filled : checkedfields = 6 else = 0.
    // because this variable is directly responsible for submitting a legit coupon. 
    var checkedFields;
    var addNewCouponFlag = 0; // 1 : yes => please do it. |  : 0 => no god no. dont !
    
    
    setupEventListeners = function() {
        // var DOM = UICtrl.getDOMStrings();
        
        var selectedElementIs = UICtrl.getSelectedElementIs();
        selectedElementIs.couponsWrapper.addEventListener('click', CtrlExpandCoupon);
        selectedElementIs.goBackButton.addEventListener('click', CtrlShrinkCoupon);
        selectedElementIs.couponsWrapper.addEventListener('click', CtrlToggleCross); 
        selectedElementIs.deleteButton.addEventListener('click', CtrlDeleteAllFieldsInOneCoupon);
        selectedElementIs.deleteAllButton.addEventListener('click', CtrlReset);
        selectedElementIs.nextCouponButton.addEventListener('click', CtrlGoToNextCoupon)
        selectedElementIs.fillRandomlyButton.addEventListener('click', CtrlRandomButton)

    };

    // this is a helping function. its is not called directly from any event listener.
    function CtrlAddNewCoupon(){
        //create name of the coupon U gonna add to the allCoupons object in the Jackpot module.
        var newCouponName = UICtrl.getExpandedCoupon().id;
        //get checked fields
       var pickedFields = UICtrl.getCheckedFields();
       jackpotCtrl.addCoupon(pickedFields,newCouponName);
    }

    // it would way more efficient. if you have only one function to open a coupon. (you tried it , it didnt work because of the passed argument. U created it in way , if the argument if defined then use it. otherwise get the id from the clicked element.)
    function openNextCoupon(couponId) {  // you can make the other big expand coupon , use this one ad a helping function. it passes the target-coupon ID to it after it defines it.
        UICtrl.expandCoupon(couponId);
        if(jackpotCtrl.hasCoupon(couponId) === 1){ checkedFields = 4; UICtrl.showNextCouponButton(); } else { checkedFields = 0; UICtrl.fieldsClickable(); }
        UICtrl.currentCouponUnclickable();
        // console.log('just before showGobackButton');
        UICtrl.CouponUnclickable(couponId); // because we just turned it into clickable, as we called the schrinkCoupon method. in the same event handler
        UICtrl.showGobackButton();
        UICtrl.hideDeleteAllButton();
        UICtrl.showRandomButton();
    }

    function CtrlExpandCoupon() {
        var cpnClickedId;
        if(event.target.classList.contains('coupon')){ 
            UICtrl.showRandomButton();
            var cpnClickedId = event.target.id;
            UICtrl.expandCoupon(cpnClickedId);
            //decide what value we give to checkedFields
            // console.log('the id is ' + cpnClickedId);
            // console.log('rsult of hasCoupon ' + jackpotCtrl.hasCoupon(cpnClickedId));
            if(jackpotCtrl.hasCoupon(cpnClickedId) === 1){ checkedFields = 4; UICtrl.showNextCouponButton(); } else { checkedFields = 0; UICtrl.fieldsClickable(); }
            UICtrl.currentCouponUnclickable(); // because if you can click it between the fields . it will mess up the checkedFields variable. !
            //show and hide buttons
            UICtrl.showGobackButton();
            UICtrl.hideDeleteAllButton();
        }
        // console.log('CtrlExpandCoupon is called , and this the chckedfileds' + checkedFields);
     
    }

    function CtrlShrinkCoupon() {
        // we allowed to go back . only if the coupon is fully filled , or completely emtpy.
        if(checkedFields === 4 || checkedFields === 0 ) {
            UICtrl.currentCouponClickable(); // we make the recently blocked coupon clickable again , in case later we wanna expand again it and modify it .
            if(addNewCouponFlag) { CtrlAddNewCoupon(); addNewCouponFlag = 0;}
            UICtrl.shrinkCoupon();
            UICtrl.hideNextCouponButton();
            UICtrl.hideGobackButton();
            UICtrl.showDeleteAllButton();
        }
        else { alert('Um den Schein abgeben zu können, muss dieser vervollständigt oder gelöscht werden.'); }

        if(checkedFields === 4) {
            if(addNewCouponFlag) { CtrlAddNewCoupon(); addNewCouponFlag = 0;}
        }
        console.log('CtrlShrinkCoupon is called , and this the chckedfileds' + checkedFields);
        UICtrl.hideRandomButton();
        
    }

    function CtrlToggleCross() {
        var elementClicked ;
        elementClicked = event.target;
        console.log(elementClicked);


        if(elementClicked.classList.contains('field--goingBig')){
            if(elementClicked.childElementCount == 1)  {
                UICtrl.addCross(elementClicked);
                checkedFields++;
                // console.log(checkedFields);
                if(checkedFields === 4) {
                    UICtrl.showNextCouponButton();
                    addNewCouponFlag = 1 ; // permission flag.
                    //3)block all other fields and coupons.
                    UICtrl.fieldsUnclickable();
                }

            }
            else if(elementClicked.childElementCount == 2){
                UICtrl.removeCross(elementClicked);
                checkedFields--;
                console.log(checkedFields);
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

    function CtrlRandomButton(){
        UICtrl.fillRandomly();
        var num = UICtrl.getCheckedFields();
        var name = UICtrl.getExpandedCoupon().id;
        jackpotCtrl.addCoupon(num,name);
        UICtrl.fieldsUnclickable();
        checkedFields = 4;
        UICtrl.showNextCouponButton();
    }


    function CtrlReset() {
        // remove that coupon from the object. if its there.
        // addNewCouponFlag = 0;
        // UICtrl.fieldsClickable();
        jackpotCtrl.deleteAllCoupons();
        UICtrl.setInitialUI();
        // console.log('deleteall clicked = thisi is the flag : ' + addNewCouponFlag);
    }

    return {
        init: function() {
            UICtrl.setInitialUI();
            setupEventListeners();
        }
    }

})(JackpotController,UIController);


controller.init();








