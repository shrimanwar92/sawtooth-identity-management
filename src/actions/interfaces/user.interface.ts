interface IUser {
	firstName: string,
	lastName: string,
	dob: string,
	aadhar: string,
	pan: string,
	documents: Array<string>,
	approvedList: Array<string>
}

export default IUser;