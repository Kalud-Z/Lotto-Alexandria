
// set the height of certain elements based on an automatically calculated height of another element.
(function setCouponHeights() {
    var heightOfCoupon = document.querySelector('.couponsGroup__coupon').clientHeight;
    var allCoupons = document.querySelectorAll('.couponsGroup__coupon');

    for(var i = 0 ; i < allCoupons.length ; i++) {
        allCoupons[i].style.height = heightOfCoupon + 'px';
    }
})(); 



// in CSS I set a cursor:pointer to all the elements. now Im gonna change for specific elements.
(function setCursorPointer() {
    var allElements = document.querySelectorAll('.couponsGroup__poolNumbersContainer');

    for(var i = 0 ; i < allElements.length ; i++) {
        if(allElements[i].classList.contains('display-none')) {
            allElements[i].parentNode.style.cursor = 'unset';
        }
    }
})(); 



// upon loading the page. elemetns appear one after the other. Beautiful !
(function startShowCoupons() {
    var delay = 0.01;
    var allElements = document.querySelectorAll('.couponsGroup__coupon');
    for(var i = 0 ; i < allElements.length ; i++) {
        allElements[i].style.transitionDelay = delay + 's'; 
        allElements[i].style.opacity = '1';
        delay = delay + 0.035;
    }
})(); 






















