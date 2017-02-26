$(document).ready(function() {

    $(function() {
        $('.col').click(
            function() {
                $(this).toggleClass("color");
                route_status = $(this).attr('id');
            });
    });

    $(function() {
        $('.listS').click(
            function(){
                start = this.value;
            });
    });

    $(function() {
        $('.listE').click(
            function(){
                end = this.value;
            });
    });
});

function dropDownS() {
    document.getElementById("myDropdownStart").classList.toggle("show");
}
function dropDownE() {
    document.getElementById("myDropdownEnd").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;

        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}