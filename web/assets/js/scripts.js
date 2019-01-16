
jQuery(document).ready(function() {
	
    /*
        Fullscreen background
    */

    
    /*
        Form validation
    */
    $('.login-form input[type="text"], .login-form input[type="password"], .login-form textarea').on('focus', function() {
    	$(this).removeClass('input-error');
    });
    
    $('.login-form').on('submit', function(e) {
    	var errorMessagePanel = $(this).find("#error-message");
    	$(this).find('input[type="text"], input[type="password"], textarea').each(function(){
    		if( $(this).val() == "" ) {
    			e.preventDefault();
    			$(this).addClass('input-error');
                errorMessagePanel.text("Fill all fields");
    		}
    	});

        var passwordField = $(this).find("#form-password");
        var confirmPasswordField = $(this).find("#form-confirm-password");

        if(passwordField.val() == confirmPasswordField.val()){
            $(this).removeClass('input-error');
        }else{
            e.preventDefault();
            confirmPasswordField.addClass('input-error');
            errorMessagePanel.text("Password mismatch!");
        }
        var passwordStrengthRegEx = /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;

        if(passwordStrengthRegEx.test(passwordField.val()) ){
            $(this).removeClass('input-error');
		}else{
            e.preventDefault();
            passwordField.addClass('input-error');
            errorMessagePanel.text("The password must have at least one uppercase letter, one lowercase letter, one number, one special character and should have at least eight characters in length");
		}


    });
    
    
});
