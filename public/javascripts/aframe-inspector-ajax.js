// $(document).ready(function() {
//     var labUrl = document.URL;  // Get full url
//     labUrl = labUrl.substr(labUrl.lastIndexOf('/') + 1); // Get specifically the lab url from the full url
//     $('#saveChangeButton').click(function() {
//       $.ajax({
//           url: '/dashboard/lab/' + labUrl + '/save',
//           type: 'POST',
//           contentType: 'application/json',
//           dataType: 'json',
//           data: JSON.stringify(AFRAME.INSPECTOR.history.updates)
//       });
//   });
// });

    // _this.writeChanges = function () {
    //   var xhr = new XMLHttpRequest();
    //   xhr.open('POST', 'https://176ac3f6b8e64b9f992a34669396e732.vfs.cloud9.us-east-1.amazonaws.com/dashboard/lab/' + labUrl + '/save');
    //   xhr.onerror = function () {
    //     alert('aframe-watcher not running. This feature requires a companion service running locally. npm install aframe-watcher to save changes back to file. Read more at supermedium.com/aframe-watcher');
    //   };
    //   xhr.setRequestHeader('Content-Type', 'application/json');
    //   xhr.send(JSON.stringify(AFRAME.INSPECTOR.history.updates));
    // };
    
$(document).ready(function() {
    var element = document.querySelector('a-scene');
    
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type == "attributes") {
                console.log("Attributes changed for " + mutation.target.attributes[0].value)
                console.log("AFRAME Inspector reports: ", JSON.stringify(AFRAME.INSPECTOR.history.updates));
            }
        });
    });
    
    observer.observe(element, {
        attributes: true, //configure it to listen to attribute changes
        childList: true,
        subtree: true
    }); 
});