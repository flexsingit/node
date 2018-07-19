'use strict';
const moment = require('moment');
const extractFirstLetter = (text) => text.charAt(0);

exports.userTable = (status_list, pilot_status_list, recordsTotal, data, draw) => {
	
	let result = [];
	for (var i = data.length - 1; i >= 0; i--) {
		let srno = i+1,
			inputJson = {
			  _id:data[i]._id,
			  pilot_request:data[i].pilot_request
		    };
		let rowid=JSON.stringify(inputJson);
		let statuscond = data[i].pilot_request == 'Pending' && !data[i].status
						 ? 'Pending' 
						 : data[i].pilot_request == 'Approved' && data[i].status
						 ? 'Active'
						 :  data[i].pilot_request == 'Rejected' && !data[i].status	 
						 ?  'Rejected'
						 :  'Inactive';

		result[i] = {
			id:`<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
					<input name="id[]" type="checkbox" class="checkboxes" value='${rowid}'/>
					<span></span>
				</label>`,
			sr_no: srno,
			contact_name: data[i].contact_name || '-',
			contact_telephoneno: data[i].contact_telephoneno || '-',
			email_address: data[i].email_address || '-',
			school_name: data[i].school_name,
			school_address: data[i].school_address,
			no_of_students: data[i].no_of_students,  
			status: `<span class="label label-sm label-${status_list.class[statuscond]}">${statuscond}</span>`,
			//pilot_request: `<span class="label label-sm tooltips label-${pilot_status_list.class[data[i].pilot_request]}" data-original-title="${pilot_status_list.status[data[i].pilot_request]}">${extractFirstLetter(pilot_status_list.status[data[i].pilot_request])}</span>`,
			action: `<div class="btn-group dropdown">
					  <button class="btn btn-info btn-xs dropdown-toggle" id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					    Action
					    <span class="caret"></span>
					  </button>
					  <ul class="dropdown-menu pull-right" aria-labelledby="dLabel">
					   		  <li><a href="#!/view-user/${data[i]._id}">View</a></li>

					   		  ${data[i].pilot_request == 'Rejected' && !data[i].status?
                              `<li><a class="approve-table-row" data-value="${data[i]._id}">Approve</a></li>`
                              : ''}

                              ${data[i].pilot_request == 'Pending' && !data[i].status?
                              `<li><a class="reject-table-row" data-value="${data[i]._id}">Reject</a></li><li><a class="approve-table-row" data-value="${data[i]._id}">Approve</a></li>`
                              : ''}
                              
                              ${data[i].pilot_request == 'Approved' && !data[i].status?
                              `<li><a class="active-table-row" data-value="${data[i]._id}">Active</a></li>`
                              : ''}

                              ${data[i].pilot_request == 'Approved' && data[i].status?
                              `<li><a class="inactive-table-row" data-value="${data[i]._id}">Inactive</a></li>`
                              : ''}
					  </ul>
					</div>`
		};
	}
	return {
		recordsTotal: recordsTotal,
		data: result,
		recordsFiltered: recordsTotal,
		draw: draw
	};
};

exports.sortingDatatable = (col,order) => {
	let columnindx,dir,result={};
	    columnindx = order[0].column;
	    dir 	   = order[0].dir; 
    var fieldname  = col[columnindx].data;
    result[fieldname]=dir;
    return result;
}

exports.socialLinkTable = (status_list, recordsTotal, data, draw) => {
	
	let result = [];
	for (var i = data.length - 1; i >= 0; i--) {
	result[i] = {
			id:`<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
					<input name="id[]" type="checkbox" class="checkboxes" value="${data[i]._id}"/>
					<span></span>
				</label>`,
			title: data[i].title,
			url: data[i].url,
			created_date: moment(data[i].created_at).format('MMM D, YYYY'),
			updated_date: moment(data[i].updated_at).format('MMM D, YYYY'),
			status: `<span class="label label-sm label-${status_list.class[data[i].status]}">${status_list.status[data[i].status]}</span>`,
			action: `<div class="btn-group dropdown">
					  <button class="btn btn-info btn-xs dropdown-toggle" id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					    Action
					    <span class="caret"></span>
					  </button>
					  <ul class="dropdown-menu pull-right" aria-labelledby="dLabel">
					   		  <li><a href="#!/view-sociallink/${data[i]._id}">View</a></li>
                              <li><a href="#!/edit-sociallink/${data[i]._id}">Edit</a></li>
                              <li><a class="delete-table-row" data-value="${data[i]._id}">Delete</a></li>
					  </ul>
					</div>`
		};
	}
	return {
		recordsTotal: recordsTotal,
		data: result,
		recordsFiltered: result.length,
		draw: draw
	};
};

exports.whatdoStepTable = (status_list, recordsTotal, data, draw) => {
	
		let result = [];
	for (var i = data.length - 1; i >= 0; i--) {
	result[i] = {
			id:`<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
					<input name="id[]" type="checkbox" class="checkboxes" value="${data[i]._id}"/>
					<span></span>
				</label>`,
			title: data[i].title,
			short_description: data[i].short_description,
			long_description: data[i].long_description,
			order: data[i].order,
			created_date: moment(data[i].created_at).format('MMM D, YYYY'),
			updated_date: moment(data[i].updated_at).format('MMM D, YYYY'),
			status: `<span class="label label-sm label-${status_list.class[data[i].status]}">${status_list.status[data[i].status]}</span>`,
			action: `<div class="btn-group dropdown">
					  <button class="btn btn-info btn-xs dropdown-toggle" id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					    Action
					    <span class="caret"></span>
					  </button>
					  <ul class="dropdown-menu pull-right" aria-labelledby="dLabel">
					   		  <li><a href="#!/view-whatdosteps/${data[i].slug}">View</a></li>
                              <li><a href="#!/edit-whatdosteps/${data[i].slug}">Edit</a></li>
                              <li><a class="delete-table-row" data-value="${data[i]._id}">Delete</a></li>
					  </ul>
					</div>`
					/*`
					<div class="btn-group btn-group-solid">
					 	<a href="#!/view-whatdosteps/${data[i].slug}" class="btn btn-xs blue tooltips" data-original-title="View">
							<i class="fa fa-search"></i>
						</a>
						<a href="#!/edit-whatdosteps/${data[i].slug}" class="btn btn-xs yellow tooltips" data-original-title="Edit">
							<i class="fa fa-pencil"></i>
						</a>
						<button  class="btn btn-xs red tooltips delete-table-row" value="${data[i]._id}" data-original-title="Delete">
							<i class="fa fa-remove"></i>
						</button>
					</div>`*/
		};
	}
	return {
		recordsTotal: recordsTotal,
		data: result,
		recordsFiltered: result.length,
		draw: draw
	};
};


exports.cmsTable = (status_list, recordsTotal, data, draw) => {
	
	let result = [];
	for (var i = data.length - 1; i >= 0; i--) {
		result[i] = {
			id:`<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
					<input name="id[]" type="checkbox" class="checkboxes" value="${data[i]._id}"/>
					<span></span>
				</label>`,
			title: data[i].title,
			slug: data[i].slug,
			created_date: moment(data[i].created_at).format('MMM D, YYYY'),
			updated_date: moment(data[i].updated_at).format('MMM D, YYYY'),
			status: `<span class="label label-xs label-${status_list.class[data[i].status]}">${status_list.status[data[i].status]}</span>`,
			action: `<div class="btn-group dropdown">
					  <button class="btn btn-info btn-xs dropdown-toggle" id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					    Action
					    <span class="caret"></span>
					  </button>
					  <ul class="dropdown-menu pull-right" aria-labelledby="dLabel">
					   		  <li><a href="#!/view-cms/${data[i].slug}">View</a></li>
                              <li><a href="#!/edit-cms/${data[i].slug}">Edit</a></li>
                              <li><a class="delete-table-row" data-value="${data[i]._id}">Delete</a></li>
					  </ul>
					</div>`
		};
	}
	return {
		recordsTotal: recordsTotal,
		data: result,
		recordsFiltered: result.length,
		draw: draw
	};
};

exports.faqTable = (status_list, recordsTotal, data, draw) => {
	
	let result = [];
	for (var i = data.length - 1; i >= 0; i--) {
		result[i] = {
			id:`<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
					<input name="id[]" type="checkbox" class="checkboxes" value="${data[i]._id}"/>
					<span></span>
				</label>`,
			question: data[i].question,
			order: data[i].order,
			created_date: moment(data[i].created_at).format('MMM D, YYYY'),
			updated_date: moment(data[i].updated_at).format('MMM D, YYYY'),
			status: `<span class="label label-sm label-${status_list.class[data[i].status]}">${status_list.status[data[i].status]}</span>`,
			action: `<div class="btn-group dropdown">
					  <button class="btn btn-info btn-xs dropdown-toggle" id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					    Action
					    <span class="caret"></span>
					  </button>
					  <ul class="dropdown-menu pull-right" aria-labelledby="dLabel">
					   		  <li><a href="#!/view-faq/${data[i]._id}">View</a></li>
                              <li><a href="#!/edit-faq/${data[i]._id}">Edit</a></li>
                              <li><a class="delete-table-row" data-value="${data[i]._id}">Delete</a></li>
					  </ul>
					</div>`
	
		};
	}
	return {
		recordsTotal: recordsTotal,
		data: result,
		recordsFiltered: result.length,
		draw: draw
	};
};

exports.mailTable=(status_list,recordsTotal,data,draw)=>{
	console.log(recordsTotal);
	let result=[];
	for(var i=data.length-1;i>=0;i--){
		result[i]={
		from:data[i].from,
		created_at: moment(data[i].created_at).format('MMM D, YYYY'),
		to:data[i].to,
		subject:data[i].subject,
		status:data[i].status,
		html:data[i].html,
		action: `<div class="btn-group dropdown">
					  <button class="btn btn-info btn-xs dropdown-toggle" id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					    Action
					    <span class="caret"></span>
					  </button>
					  <ul class="dropdown-menu pull-right" aria-labelledby="dLabel">
					   		  <li><a href="#!/view-mail/${data[i]._id}">View</a></li>
					  </ul>
					</div>`
			};
	}
	return {
		recordsTotal: recordsTotal,
		data: result,
		recordsFiltered: recordsTotal,
		draw: draw
	};
};

exports.siteSettingTable = (status_list, recordsTotal, data, draw) => {
	
	let result = [];
	for (var i = data.length - 1; i >= 0; i--) {
	result[i] = {
			id:`<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
					<input name="id[]" type="checkbox" class="checkboxes" value="${data[i]._id}"/>
					<span></span>
				</label>`,
			site_url: data[i].site_url,
			site_logo: `<img alt="No Image" src='${data[i].site_logo?data[i].site_logo.path:''}' width='185' height='70'>`,
			support_email: data[i].support_email,
			created_date: moment(data[i].created_at).format('MMM D, YYYY'),
			updated_date: moment(data[i].updated_at).format('MMM D, YYYY'),
			status: `<span class="label label-sm label-${status_list.class[data[i].status]}">${status_list.status[data[i].status]}</span>`,
			action: `<div class="btn-group dropdown">
					  <button class="btn btn-info btn-xs dropdown-toggle" id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					    Action
					    <span class="caret"></span>
					  </button>
					  <ul class="dropdown-menu pull-right" aria-labelledby="dLabel">
					   		  <li><a href="#!/view-sitesetting/${data[i]._id}">View</a></li>
                              <li><a href="#!/edit-sitesetting/${data[i]._id}">Edit</a></li>
                              <li><a class="delete-table-row" data-value="${data[i]._id}">Delete</a></li>
					  </ul>
					</div>`
			};
	}
	return {
		recordsTotal: recordsTotal,
		data: result,
		recordsFiltered: result.length,
		draw: draw
	};
};


exports.studentTable = (recordsTotal, data, draw) => {
	
	let result = [];
	for (var i = data.length - 1; i >= 0; i--) {
	result[i] = {
			id:`<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
					<input name="id[]" type="checkbox" class="checkboxes" value="${data[i]._id}"/>
					<span></span>
				</label>`,
			name: data[i].first_name + ' '+data[i].last_name,
			osis_number: data[i].osis_number,
			dob: moment(data[i].dob).format('MMM D, YYYY'),
			gender: data[i].gender,
			updated_date: moment(data[i].updated_at).format('MMM D, YYYY'),
			action: `<div class="btn-group dropdown">
					  <button class="btn btn-info btn-xs dropdown-toggle" id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					    Action
					    <span class="caret"></span>
					  </button>
					  <ul class="dropdown-menu pull-right" aria-labelledby="dLabel">
					   		  <li><a href="#!/view-students/${data[i]._id}">View</a></li>
                              <li><a href="#!/edit-students/${data[i]._id}">Edit</a></li>
                              <li><a class="delete-table-row" data-value="${data[i]._id}">Delete</a></li>
					  </ul>
					</div>`
			};
	}
	return {
		recordsTotal: recordsTotal,
		data: result,
		recordsFiltered: result.length,
		draw: draw
	};
};



exports.privacypolicyTable = (status_list, recordsTotal, data, draw) => {
	
		let result = [];
	for (var i = data.length - 1; i >= 0; i--) {
		result[i] = {
			id:`<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
					<input name="id[]" type="checkbox" class="checkboxes" value="${data[i]._id}"/>
					<span></span>
				</label>`,
			title: data[i].title,
			description: data[i].description,
			created_date: moment(data[i].created_at).format('MMM D, YYYY'),
			status: `<span class="label label-sm label-${status_list.class[data[i].status]}">${status_list.status[data[i].status]}</span>`,
			action: `
					<div class="btn-group btn-group-solid">
						<a href="#!/view-privacypolicy/${data[i]._id}" class="btn btn-sm btn-outline blue tooltips" data-original-title="View">
							<i class="fa fa-search"></i>
						</a>
						<a href="#!/edit-privacypolicy/${data[i]._id}" class="btn btn-sm btn-outline grey-salsa tooltips" data-original-title="Edit">
							<i class="fa fa-pencil"></i>
						</a>
					</div>`
		};
	}
	return {
		recordsTotal: recordsTotal,
		data: result,
		recordsFiltered: result.length,
		draw: draw
	};
};
exports.blogTable = (status_list, recordsTotal, data, draw) => {
	
	let result = [];
	for (var i = data.length - 1; i >= 0; i--) {
		result[i] = {
			id:`<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
					<input name="id[]" type="checkbox" class="checkboxes" value="${data[i]._id}"/>
					<span></span>
				</label>`,
			title: data[i].title,
			type: data[i].type,
			slug: data[i].slug,
			created_date: moment(data[i].created_at).format('MMM D, YYYY'),
			status: `<span class="label label-sm label-${status_list.class[data[i].status]}">${status_list.status[data[i].status]}</span>`,
			action: `
					<div class="btn-group btn-group-solid">
						<a href="#!/view-blog/${data[i].slug}" class="btn btn-sm btn-outline blue tooltips" data-original-title="View">
							<i class="fa fa-search"></i>
						</a>
						<a href="#!/edit-blog/${data[i].slug}" class="btn btn-sm btn-outline grey-salsa tooltips" data-original-title="Edit">
							<i class="fa fa-pencil"></i>
						</a>
					</div>`
		};
	}
	return {
		recordsTotal: recordsTotal,
		data: result,
		recordsFiltered: result.length,
		draw: draw
	};
};


exports.testimonialTable = (status_list, recordsTotal, data, draw) => {
	
	let result = [];
	for (var i = data.length - 1; i >= 0; i--) {
		result[i] = {
			id:`<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
					<input name="id[]" type="checkbox" class="checkboxes" value="${data[i]._id}"/>
					<span></span>
				</label>`,
			name: data[i].name,
			created_date: moment(data[i].created_at).format('MMM D, YYYY'),
			status: `<span class="label label-sm label-${status_list.class[data[i].status]}">${status_list.status[data[i].status]}</span>`,
			action: `
					<div class="btn-group btn-group-solid">
						<a href="#!/view-testimonial/${data[i]._id}" class="btn btn-sm btn-outline blue tooltips" data-original-title="View">
							<i class="fa fa-search"></i>
						</a>
						<a href="#!/edit-testimonial/${data[i]._id}" class="btn btn-sm btn-outline grey-salsa tooltips" data-original-title="Edit">
							<i class="fa fa-pencil"></i>
						</a>
					</div>`
		};
	}
	return {
		recordsTotal: recordsTotal,
		data: result,
		recordsFiltered: result.length,
		draw: draw
	};
};
