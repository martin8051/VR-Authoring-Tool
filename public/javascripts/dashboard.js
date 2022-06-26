/* global $ */
function calculateFileSize(fileSize) {
    var calculatedFileSizeString;
    var fileSizeExt = ['Bytes', 'KB', 'MB', 'GB'];
    var i = 0;
    while(fileSize > 900) {
        fileSize /= 1024;
        i++;
    }

    calculatedFileSizeString = (Math.round(fileSize*100)/100) + ' ' + fileSizeExt[i];
    
    return calculatedFileSizeString;
}

function greetingMessage() {
    let date = new Date();
    let currentHour = date.getHours();
    let message = "Welcome";
    
    if(currentHour >= 5 && currentHour < 12) message = "Good Morning";
    else if(currentHour >= 12 && currentHour <= 18) message = "Good Afternoon";
    else if(currentHour >= 18 && currentHour <= 23) message = "Good Evening";
    
    return  message;
}

function formatTime(timeToBeFormatted) {
    let formattedTime = "";
    let hourTime = timeToBeFormatted.toString().slice(0,2);
    if(Number(hourTime) < 12)
    {
        if(Number(hourTime) == 0) formattedTime = "12" + timeToBeFormatted.slice(2) + " AM";
        else formattedTime = hourTime + timeToBeFormatted.slice(2) + " AM";    
    }
    else
    {
        let calculatedHour = Number(hourTime) - 12;
        if(calculatedHour == 0) calculatedHour = 12; // 12 - 12 = 0 meaning it is 12am or  
        formattedTime = calculatedHour.toString() + timeToBeFormatted.slice(2) + " PM";   
    }
    
    return formattedTime;
}

function convertTimeToMilitaryTime(timeToBeFormatted = "") {
    let timeInArry = timeToBeFormatted.split(' ');
    let hourPeriod = timeInArry[1];
    
    return (hourPeriod == "AM") ? timeInArry[0] : (12 + Number(timeInArry[0].split(':')[0])).toString().concat(timeInArry[0].slice(1));
}

function getUserID() {
    return document.cookie.split('; ').find(row => row.startsWith('userID=')).split('=')[1];
}

function getFirstName(userFullName = "") {
    $('#userFirstName').text(userFullName.split(" ")[0]);
}

async function saveSettings(e) {
    e.preventDefault();
    $.ajax({
        url: `${window.location.pathname}/settings-update`,
        type: 'POST',
        cache: false,
        contentType: 'application/json',
        dataType:'json',
        data: JSON.stringify({
            fullName: document.getElementById('saving-profile')[0].value,
            //currentPassInput: document.getElementById('saving-profile')[1].value,
            newPassInput: document.getElementById('saving-profile')[1].value,
            reNewPassInput: document.getElementById('saving-profile')[2].value
        })
    }).done(function(res, textStatus, xhr) {
        $('#accountSettings').modal('hide').on('hidden.bs.modal', function (e) {
            $('body').removeClass('modal-open');
            if($('.modal-backdrop').length > 1) $('.modal-backdrop').remove();
            setTimeout(function(){
                $('#notificationAlert').addClass('show');
                $('#notificationAlert').addClass((xhr.status == 200 ? 'alert-success' : 'alert-danger'));
                $('#notificationAlert').text(res.message);
            }, 1000);
        });
        setTimeout(function(){
            $('#notificationAlert').removeClass('show');
            $('#notificationAlert').removeClass((xhr.status == 200 ? 'alert-success' : 'alert-danger'));
            $('#notificationAlert').text('');
            window.location.reload();
        }, 4000);
    }).fail(function(res) {
        $('#accountSettings').modal('hide').on('hidden.bs.modal', function (e) {
            $('body').removeClass('modal-open');
            setTimeout(function(){
                $('#notificationAlert').addClass('show');
                $('#notificationAlert').addClass('alert-danger');
                $('#notificationAlert').text(res.responseJSON.name + ': ' + res.responseJSON.message);
            }, 1000);
        });
        setTimeout(function(){
            $('#notificationAlert').removeClass('show');
            $('#notificationAlert').removeClass('alert-danger');
            $('#notificationAlert').text('');
        }, 4000);
    });
}

async function saveNewLab(e) {
    e.preventDefault();
    $.ajax({
        url: `${window.location.pathname}/save-lab`,
        type: 'POST',
        cache: false,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            title: document.getElementById('labFormModal')[0].value,
            startTime: formatTime(document.getElementById('labFormModal')[1].value),
            startDate: document.getElementById('labFormModal')[2].value,
            vrScene: document.getElementById('labFormModal')[3].value
        })
    }).done(function(res, textStatus, xhr) {
        // console.log(res.message);
        $('#createANewLabModal').modal('hide').on('hidden.bs.modal', function (e) {
            $('body').removeClass('modal-open');
            if($('.modal-backdrop').length > 1) $('.modal-backdrop').remove();
            setTimeout(function(){
                $('#notificationAlert').addClass('show');
                $('#notificationAlert').addClass((xhr.status == 200 ? 'alert-success' : 'alert-danger'));
                $('#notificationAlert').text(res.message);
            }, 1000);
        });
        setTimeout(function(){
            $('#notificationAlert').removeClass('show');
            $('#notificationAlert').removeClass((xhr.status == 200 ? 'alert-success' : 'alert-danger'));
            $('#notificationAlert').text('');
        }, 5000);
        window.location.reload();
    }).fail(function(res) {
        $('#createANewLabModal').modal('hide').on('hidden.bs.modal', function (e) {
            $('body').removeClass('modal-open');
            setTimeout(function(){
                $('#notificationAlert').addClass('show');
                $('#notificationAlert').addClass('alert-danger');
                $('#notificationAlert').text(res.responseJSON.name + ': ' + res.responseJSON.message);
            }, 1000);
        });
        setTimeout(function(){
            $('#notificationAlert').removeClass('show');
            $('#notificationAlert').removeClass('alert-danger');
            $('#notificationAlert').text('');
        }, 5000);
    });
}

async function updateLab(e) {
    e.preventDefault();
    console.log(document.getElementById('updateLabModal').dataset.labId);
    $.ajax({
        url: `${window.location.pathname}/update-lab`,
        type: 'POST',
        cache: false,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            id: document.getElementById('updateLabModal').dataset.labId, 
            title: document.getElementById('updateLabFormModal')[0].value,
            startTime: formatTime(document.getElementById('updateLabFormModal')[1].value),
            startDate: document.getElementById('updateLabFormModal')[2].value,
            vrScene: document.getElementById('updateLabFormModal')[3].value
        })
    }).done(function(res, textStatus, xhr) {
        // console.log(res.message);
        $('#updateLabModal').modal('hide').on('hidden.bs.modal', function (e) {
            $('body').removeClass('modal-open');
            if($('.modal-backdrop').length > 1) $('.modal-backdrop').remove();
            setTimeout(function(){
                $('#notificationAlert').addClass('show');
                $('#notificationAlert').addClass((xhr.status == 200 ? 'alert-success' : 'alert-danger'));
                $('#notificationAlert').text(res.message);
            }, 1000);
        });
        setTimeout(function(){
            $('#notificationAlert').removeClass('show');
            $('#notificationAlert').removeClass((xhr.status == 200 ? 'alert-success' : 'alert-danger'));
            $('#notificationAlert').text('');
            window.location.reload();
        }, 5000);
    }).fail(function(res) {
        $('#updateLabModal').modal('hide').on('hidden.bs.modal', function (e) {
            $('body').removeClass('modal-open');
            setTimeout(function(){
                $('#notificationAlert').addClass('show');
                $('#notificationAlert').addClass('alert-danger');
                $('#notificationAlert').text(res.responseJSON.name + ': ' + res.responseJSON.message);
            }, 1000);
        });
        setTimeout(function(){
            $('#notificationAlert').removeClass('show');
            $('#notificationAlert').removeClass('alert-danger');
            $('#notificationAlert').text('');
        }, 5000);
    });
}

function updateModalLabForm(e) {
    $('#updateLabModal')[0].dataset.labId = e.target.dataset.id;
    $('#updateLabModalLabel').text(e.target.dataset.title);
    $('#updateTitleInput').attr("placeholder", e.target.dataset.title);
    $('#updateTitleInput').val(e.target.dataset.title);
    $('#updateTimeInput').val(convertTimeToMilitaryTime(e.target.dataset.time));
    $('#updateDateInput').val(e.target.dataset.date.split('T')[0]);
    let selectedOptionElem = $('#updateSceneSelectInput')[0].options;
    let optionCount =  selectedOptionElem.length;
    
    for(let i = 0; i < optionCount; i++) {
       if(selectedOptionElem[i].value == e.target.dataset.scene) {
           $('#updateSceneSelectInput').val(i);
           $(`#updateSceneSelectInput option:eq(${i})`).prop('selected', true)
          break;
       }
    }
    
    $('#updateLabButton').click(updateLab);
}

async function deleteLab(e) {
    $.ajax({
        url: 'dashboard/delete-lab',
        type: 'DELETE',
        cache: false,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            labId: e.target.dataset.id, 
            labTitle: e.target.dataset.title
        })
    })
    .done(function(res, textStatus, xhr) {
        if(res.deleted)
        {
            $('#' + e.target.dataset.id).remove()
            setTimeout(function(){
                $('#notificationAlert').addClass('show');
                $('#notificationAlert').addClass('alert-success');
                $('#notificationAlert').text(res.message);
            }, 1000);
            setTimeout(function(){
                $('#notificationAlert').removeClass('show');
                $('#notificationAlert').removeClass('alert-success');
                $('#notificationAlert').text('');
            }, 5000);
        }
        else
        {
            setTimeout(function(){
                $('#notificationAlert').addClass('show');
                $('#notificationAlert').addClass('alert-danger');
                $('#notificationAlert').text(res.message);
            }, 1000);
            setTimeout(function(){
                $('#notificationAlert').removeClass('show');
                $('#notificationAlert').removeClass('alert-danger');
                $('#notificationAlert').text('');
            }, 5000);
        }
    })
    .fail(function(res) {
        console.log(res);
    });
}

$(document).ready(function() {
    
    $('.deleteButton').each(function() {
        $(this).click(deleteLab);
    });
    
    // Listen to title input and change the title of the modal to the title
    $('#titleInput').on('propertychange input', function(e) {
        // console.log(e); // uncomment to view event in console
        var valueChanged = false;
        
        if (e.type == 'propertychange')
            valueChanged = e.originalEvent.propertyName == 'value';
        else
            valueChanged = true;

        if (valueChanged)
        {
            $('#createANewLabModalLabel').text(e.target.value);
    
            // if input value is empty, insert original title "Lab Title"
            if(!e.target.value) $('#createANewLabModalLabel').text("Lab Title");
        }
    });
    
    $('#firstNameInput').on('propertychange input', function(e) {
        var valueChanged = false;
        // console.log(e); // uncomment to view event in console

        if (e.type == 'propertychange')
            valueChanged = e.originalEvent.propertyName == 'value';
        else
            valueChanged = true;

        if (valueChanged)
        {
            // if both new password and re-enter passwords inputs are empty or not
            if((($('#newPassInput').val() || $('#newPassInput').val().length > 0) && ($('#reNewPassInput').val() || $('#reNewPassInput').val().length > 0)) || (((!$('#newPassInput').val()) || $('#newPassInput').val().length === 0) && ((!$('#reNewPassInput').val()) || $('#reNewPassInput').val().length === 0)))
            {
                // check if disabled is true and set disable to false
                if((e.target.value || e.target.value.length > 0) && $('#updateSettings').attr('disabled')) 
                    $('#updateSettings').prop('disabled', false);
                    
                // if input value is empty, disable save button
                else if(!e.target.value && ($('#newPassInput').val() || $('#newPassInput').val().length > 0)) 
                    $('#updateSettings').prop('disabled', false);
                
                // if first name input is empty, set disable to true
                else if(!e.target.value)
                    $('#updateSettings').prop('disabled', true);
            }

        }
    });
    
    $('#newPassInput').on('propertychange input', function(e) {
        // console.log(e); // uncomment to view event in console
        var valueChanged = false;

        if (e.type == 'propertychange')
            valueChanged = e.originalEvent.propertyName == 'value';
        else
            valueChanged = true;

        if (valueChanged)
        {   
            // if new password and re-enter password input are NOT empty
            if((e.target.value || e.target.value.length > 0) && ($('#reNewPassInput').val() || $('#reNewPassInput').val().length > 0))
            {
                // then check if disabled is true, set disable to false
                if($('#updateSettings').attr('disabled'))
                    $('#updateSettings').prop('disabled', false);   
            }
    
            // if new password input value is empty, disbale save button
            else if(!e.target.value || e.target.value.length === 0)
            {
                // but first check to see if first name input is not empty
                if($('#firstNameInput').val() || $('#firstNameInput').val().length > 0)
                {
                    // if re-enter password input is empty as well
                    if((!$('#reNewPassInput').val()) || $('#reNewPassInput').val().length === 0)
                        // set disable to false because first name input is not empty
                        $('#updateSettings').prop('disabled', false);
                    else
                        // set disbale to true because 
                        $('#updateSettings').prop('disabled', true);
                }
                else
                    // otherwise, all the inputs are empty
                    // set disable to true because the entire form is empty
                    $('#updateSettings').prop('disabled', true);
            }
            else 
                $('#updateSettings').prop('disabled', true);
        }
    });
    
    $('#reNewPassInput').on('propertychange input', function(e) {
        // console.log(e); // uncomment to view event in console
        var valueChanged = false;

        if (e.type == 'propertychange')
            valueChanged = e.originalEvent.propertyName == 'value';
        else
            valueChanged = true;

        if (valueChanged)
        {
            // if new password and re-enter password input are NOT empty
            if(($('#newPassInput').val() || $('#newPassInput').val().length > 0) && (e.target.value || e.target.value.length > 0))
            {
                // check if disabled is true and set to false
                if($('#updateSettings').attr('disabled')) 
                    $('#updateSettings').prop('disabled', false);
            }
            
            // if re-enter password input value is empty, disable save button
            else if(!e.target.value || e.target.value.length === 0)
            {
                // if first name input is not empty
                if($('#firstNameInput').val() || $('#firstNameInput').val().length > 0)
                {
                    // if new password and re-enter password input are empty
                    if(((!$('#newPassInput').val()) || $('#newPassInput').val().length === 0) && ((!e.target.value) || e.target.value.length === 0))
                        // set disable to false
                        $('#updateSettings').prop('disabled', false);
                    else
                        // set disable to true
                        $('#updateSettings').prop('disabled', true);
                }
                else
                    // set disable to true because the entire form is empty
                    $('#updateSettings').prop('disabled', true);
            }
            else
                $('#updateSettings').prop('disabled', true);
        }
    });
    
    //Reset modal forms
    $('#createANewLabModal').on('hide.bs.modal', function () {
        $('#createANewLabModalLabel').text('Lab Title');
        $(this).find('form').trigger('reset');
        // document.getElementById('objFileList').innerHTML = '';
        // let removeFileBtn = document.getElementById('removeFilesButton');
        // removeFileBtn.setAttribute('disabled', true);
        // removeFileBtn.setAttribute('hidden', true);
    });
    
    $('#updateSettings').click(saveSettings);
    $('#saveNewLabButton').click(saveNewLab);
    $('.updateButton').each(function(index, elem) {
        $(elem).on('click', updateModalLabForm)
    });
    $('#greetingMsg').text(greetingMessage());
});