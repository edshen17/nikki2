<template>
<div class="Register">
		<div class="row mt-5">
			<div class="col-md-6 m-auto">
				<div class="card card-body">
					<h1 class="text-center mb-3">
						<i class="fas fa-user-plus"> Register</i>
					</h1>
					<form>
					<input v-model="form.username" class="form-control" id="username" type="username" name="username" placeholder="Enter Username"/>
					<input v-model="form.email" class="form-control" id="email" type="email" name="email" placeholder="Enter Email"/>
					<input v-model="form.password" class="form-control" id="password" type="password" name="password" placeholder="Create Password"/>
					<input v-model="form.password2" class="form-control" id="password2" type="password" name="password2" placeholder="Confirm Password"/>
					<button type="submit" class="btn btn-primary btn-block" @click.stop.prevent="submit()">Submit</button>
					</form>
				</div>
			</div>
		</div>
	</div>

</template>

<script>
import axios from 'axios';
import LayoutDefault from './layouts/LayoutDefault';

export default {
  name: 'Register',
  created() {
    this.$emit('update:layout', LayoutDefault);
  },
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
        password2: '',
      },
      serverHost: 'http://localhost:5000',
    };
  },
  methods: {
    submit() {
      axios.post(`${this.serverHost}/server/users/register`,
        { username: this.form.username,
          email: this.form.email,
          password: this.form.password,
          password2: this.form.password2,
        }).then((res) => {
        if (res.status === 201 && res.data) { // if user made
          this.$router.push('/');
        }
      }, (err) => {
        alert(err);
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
