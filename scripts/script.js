
//############################################ TEAKING STYLE ############################################





// ################################   EVENT LISTENENRS ##############################################
document.querySelector('.quickTips').addEventListener('click', openPopup);
document.querySelector('body').addEventListener('click', closePopup);



// ##########################################  FUNCTIONS #############################################
function openPopup(event) {
    var elementClickedID;
    var elementClickedID = event.target.id;

    //extract the specific type of the popup , from the clicked item.
    var exactType =  elementClickedID.substring(13, elementClickedID.length);

    // we add that type to the second part of the id of the target popup
    var exactPopupID = 'popup' + exactType;

    document.getElementById(exactPopupID).classList.add('show');
    document.getElementById(exactPopupID).firstElementChild.classList.add('showPopup');
}

function closePopup(event) {
    
    var elementClicked   =  event.target;
    var elementClickedID = elementClicked.id;
    var allFatherID;

    //we are trying to find out the popupid. if one of its children is clicked. go up , and check out their fathers, in case one of them is the popup.
    if(elementClicked.hasAttribute('id')) { allFatherID = elementClickedID; }
    else if(elementClicked.parentNode.hasAttribute('id')) { allFatherID = elementClicked.parentNode.id; }
    else if(elementClicked.parentNode.parentNode.hasAttribute('id')) { allFatherID = elementClicked.parentNode.parentNode.id; }
   
    // if the outer element is clicked , or the cancel logo is clicked.
    if(elementClickedID == allFatherID || elementClicked.classList.contains('randomNumbers-popup__cancel-logo')) {
        document.getElementById(allFatherID).classList.remove('show');
        document.getElementById(allFatherID).firstElementChild.classList.remove('showPopup');
    }     
}












