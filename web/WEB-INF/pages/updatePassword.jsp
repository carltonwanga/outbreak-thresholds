<%@include file="header.jsp"%>
<body>
<div class="top-content">

    <div class="inner-bg">
        <div class="container">
            <div class="row">
                <div class="col-sm-8 col-sm-offset-2 text">
                    <h1>${header1Operation} Password</h1>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-6 col-sm-offset-3 form-box">
                    <div class="form-top">
                        <div class="form-top-left">
                            <h3>${header3Operation} Password</h3>
                            <p>Enter your new password below:</p>
                        </div>
                        <div class="form-top-right">
                            <i class="fa fa-lock"></i>
                        </div>
                    </div>
                    <div class="form-bottom">

                        <form role="form" method="post" action="../save" class="login-form">
                            <p id = "error-message" class="error text-danger">${errorMessage}</p>
                            <div class="form-group">
                                <label class="sr-only" for="form-password">Password</label>
                                <input type="password" name="password" placeholder="Password..." class="form-password form-control" id="form-password">
                            </div>
                            <div class="form-group">
                                <label class="sr-only" for="form-confirm-password">Confirm Password</label>
                                <input type="password"  name="confirm-password" placeholder="Retype Password..." class="form-password form-control" id="form-confirm-password">
                            </div>
                            <div class="form-group">
                                <input type="text" name="token" value="${token}" id="form-token" hidden>
                            </div>
                            <div class="form-group">
                                <input type="text" name="operation" value="${header1Operation}" id="form-operation" hidden>
                            </div>
                            <button type="submit" class="btn">${header3Operation} Password!</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>

<!-- Javascript -->
<script src="<c:url value="/assets/js/jquery-1.11.1.min.js" />"></script>
<script src="<c:url value="/assets/bootstrap/js/bootstrap.min.js" />"></script>
<script src="<c:url value="/assets/js/jquery.backstretch.min.js" />"></script>
<script src="<c:url value="/assets/js/scripts.js" />"></script>
<script>
    $.backstretch('<c:url value="/assets/img/backgrounds/1.jpg" />');
</script>

<!--[if lt IE 10]>
<script src="<c:url value="/assets/js/placeholder.js" />"></script>
<![endif]-->

</body>
</html>
