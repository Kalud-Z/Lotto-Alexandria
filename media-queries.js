
var selectedElementIs = {
                    sectionPlayRight    : document.querySelector('.section-play__right'),
                    sectionPlayLeft     : document.querySelector('.section-play__left'),
                    couponContainerTitle: document.querySelector('.coupons-container__title'),
                    infoButton          : document.getElementById('info-button'),
                    couponsWrapper      : document.querySelector('.coupons-wrapper'),
                    couponsContainer    : document.querySelector('.coupons-container'),
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
            
/* 
var phone = '(max-width: 650px)';
var mql = window.matchMedia(phone);


function moveNextCouponButton(e) {
  if(e.matches) {
    (function moveNextCouponButtonToNewPosition() {
        //we remove the button from its original spot.
        var parent = selectedElementIs.sectionPlayRight;
        var target = selectedElementIs.nextCouponButton;
        var targetRemoved = parent.removeChild(target);
    
        // we insert the button in its new spot.
        parent = selectedElementIs.couponsContainer;
        parent.prepend(targetRemoved);  // append a node child as first child of the parent node.
    })();
    } 
  else { 
      (function moveNextCouponButtonToNewToOriginalPosition() {
        //we remove the button from its new spot.
        var parent = selectedElementIs.couponsContainer;
        var target = selectedElementIs.nextCouponButton;
        var targetRemoved = parent.removeChild(target);
        var referenceNode = selectedElementIs.doneFillingButton;

        // we insert the button in its original spot.
        parent = selectedElementIs.sectionPlayRight;
        parent.insertBefore(targetRemoved, referenceNode);
    })();
  }
}

mql.addListener(moveNextCouponButton);  //adding event listener to the media query list.

 */

//  the correct version 


var phone = 650;

function repositionButtons() {
  var windowWidth = document.documentElement.clientWidth;   // returns the width of the screen in pixels.

  if(windowWidth <= phone) {
    (function moveNextCouponBtnToNewPosition() {
        //we remove the button from its original spot.
        var parent = selectedElementIs.sectionPlayRight;
        var target = selectedElementIs.nextCouponButton;
        var targetRemoved = parent.removeChild(target);
    
        // we insert the button in its new spot.
        parent = selectedElementIs.couponsContainer;
        parent.prepend(targetRemoved);  // append a node child as first child of the parent node.
    })();

    (function moveDoneFillingBtnToNewPosition() {
      //we remove the button from its original spot.
      var parent = selectedElementIs.sectionPlayRight;
      var target = selectedElementIs.doneFillingButton;
      var targetRemoved = parent.removeChild(target);
  
      // we insert the button in its new spot.
      parent = selectedElementIs.sectionPlayLeft;
      parent.prepend(targetRemoved);  // append a node child as first child of the parent node.
    })();
    
  } 
  else { 

      (function moveNextCouponBtnToNewToOriginalPosition() {
        //we remove the button from its new spot.
        var parent = selectedElementIs.couponsContainer;
        var target = selectedElementIs.nextCouponButton;
        var targetRemoved = parent.removeChild(target);
        var referenceNode = selectedElementIs.doneFillingButton;

        // we insert the button in its original spot.
        parent = selectedElementIs.sectionPlayRight;
        parent.insertBefore(targetRemoved, referenceNode);
    })();
  
  }
}


repositionButtons();



// the done filling button ##########################################

// move it to : last child of 'section-play__left'

















