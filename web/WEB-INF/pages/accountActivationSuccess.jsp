<%@include file="header.jsp"%>
<body>
<div class="top-content">

    <div class="inner-bg">
        <div class="container">
            <div class="row">
                <div class="col-sm-6 col-sm-offset-3 text">
                    <h1>Success</h1>
                    <h3> <span style="color:#faf2cc;">Your account has successfully been activated</span></h3>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-6 col-sm-offset-3 form-box">
                    <div class="form-bottom">
                        <form role="form" action="<c:url value="/payments/" />">
                            <button type="submit" class="btn">Proceed to Login</button>
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

