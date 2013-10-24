<div class="homepage">
	<h1>
		<img src="assets/images/logo.png" alt="">
	</h1>

	<form action="?action=signin" method="post">
		<div class="login">
			<label for="login-connect">Login</label>
			<input id="login-connect" type="text" name="login" placeholder="luke.skywalker@etoilenoir.com">
		</div>

		<div class="password">
			<label for="password-connect">Password</label>
			<input id="password-connect" type="password" name="password" placeholder="********">
		</div>
		
		<input type="submit" value="Log in">
	</form>

	<br>

	<form action="?action=signup" class="register" method="post">
		<h2 class="register-title">Haven't Sign Up Yet ?</h2>

		<div class="login">
			<label for="login-register">Login</label>
			<input id="login-register" type="text" name="login" placeholder="Luke Skywalker">
		</div>

		<div class="password">
			<label for="password-register">Password</label>
			<input id="password-register" type="password" name="password" placeholder="********">
		</div>

		<input type="submit" value="Sign in">
	</form>
</div>
