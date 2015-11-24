$(document).ready(function(){
    $.ajax({
        url: "/cab/profile.html",
        cache: false,
        success: function(html){
            $("#content").html(html);

        }
    });
    $('#profile').click(function(){
        $.ajax({
            url: "/cab/profile.html",
            cache: false,
            success: function(html){
                $("#content").html(html);

            }
        });
    });

    $('#edit').click(function(){

        $.ajax({
            url: "/cab/edit.html",
            cache: false,
            success: function(html){
                $("#content").html(html);

            }
        });
    });
    $('#rights').click(function(){

        $.ajax({
            url: "/cab/rights.html",
            cache: false,
            success: function(html){
                $("#content").html(html);

            }
        });
    });
    $('#feedback').click(function(){

        $.ajax({
            url: "/cab/feedback.html",
            cache: false,
            success: function(html){
                $("#content").html(html);

            }
        });
    });

});