$(document).ready(function(){

    $('#first').click(function(){
        alert('first');
        $.ajax({
            url: "f.html",
            cache: false,
            success: function(html){
                $("#content").html(html);
            }
        });
    });

    $('#sec').click(function(){
        alert('second');
        $.ajax({
            url: "s.html",
            cache: false,
            success: function(html){
                $("#content").html(html);
            }
        });
    });

});