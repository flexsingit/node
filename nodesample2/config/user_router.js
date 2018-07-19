'use strict';
const path  = require('path'),
_       = require('lodash'),
multer    = require('multer'),
config    = require(require(path.resolve('./config/env')).getEnv),
fs      = require('fs');

/* Require All the controllers */
let ctrls = {};
fs.readdirSync(path.resolve('./controllers/User')).forEach(file => {
  let name = file.substr(0,file.indexOf('.js'));
  ctrls[name] = require(path.resolve(`./controllers/User/${name}`));
});

let uploadProfileImage = multer({
    limits: config.fileLimits,
    storage: multer.diskStorage({
      destination: 'assets/profile_image/',
      filename: function (req, file, cb) {
        cb(null, Date.now() + '.' + config.file_extensions[file.mimetype]);
      }
    }),
    fileFilter: fileFilter
    
});
let uploadSchoolProfileImage = multer({
    limits: config.fileLimits,
    storage: multer.diskStorage({
      destination: 'assets/schoolprofile_image/',
      filename: function (req, file, cb) {
        cb(null, Date.now() + '.' + config.file_extensions[file.mimetype]);
      }
    }),
    fileFilter: fileFilter
    
});

/* Check if file is valid image */
function fileFilter (req, file, cb) {
  if(!_.includes(config.allowed_image_extensions, file.mimetype)){
    cb(new Error('Invalid image file'));
  }
  cb(null, true);
}

let uploadTeacherCsv = multer({
    limits: config.fileLimits,
    storage: multer.diskStorage({
      destination: 'assets/teacher_uploadedcsv/',
      filename: function (req, file, cb) {
        cb(null, Date.now() + '.' + config.csv_extensions[file.mimetype]);
      }
    }),
    fileFilter: csvFilter
});

let uploadStudentCsv = multer({
    limits: config.fileLimits,
    storage: multer.diskStorage({
      destination: 'assets/student_uploadedcsv/',
      filename: function (req, file, cb) {
        cb(null, Date.now() + '.' + config.csv_extensions[file.mimetype]);
      }
    }),
    fileFilter: csvFilter
});

/* Check if file is valid csv */
function csvFilter (req, file, cb) {
  if(!_.includes(config.allowed_csv_extensions, file.mimetype)){
    cb(new Error('Invalid file, please upload a valid csv file'));
  }
  cb(null, true);
}


module.exports = {
    routes: [
      
      //--------------------SCHOOL MODULE------------
      { url: '/signupSchool', method: ctrls.userCtrl.signupSchool, type: 'post' },
      { url: '/loginSchool', method: ctrls.userCtrl.loginSchool, type: 'post' },
      { url: '/verify_email/:salt', method: ctrls.userCtrl.verifyEmail, type: 'get' },
      { url: '/forgot_password', method: ctrls.userCtrl.forgot, type: 'post' },
      { url: '/reset/:token', method: ctrls.userCtrl.validateResetToken, type: 'get' },
      { url: '/reset_password/:token', method: ctrls.userCtrl.reset, type: 'post' },
      { url: '/change_password/:id', method: ctrls.userCtrl.changePassword, type: 'post' },
      { url: '/update_schoolprofile', mwear: uploadSchoolProfileImage.any(),method: ctrls.schoolProfileCtrl.updateSchoolProfile, type: 'post' },
      { url: '/getschoolprofile_step',method: ctrls.schoolProfileCtrl.getSchoolProfileStepData, type: 'get' },
      
      //-----------------GET HOMEPAGE DATA--------------
      { url: '/contactus',method: ctrls.contactUsCtrl.createContactUs, type: 'post' },
      { url: '/verify', method: ctrls.contactUsCtrl.validateEmailToken, type: 'get' },
      { url: '/getfaq',method: ctrls.cmsCtrl.getFAQ, type: 'get' },
      { url: '/get_master_data',method: ctrls.masterCtrl.getMasterData, type: 'get' },
      { url: '/setting_homepage',method: ctrls.settingCtrl.settingHomepage, type: 'get' },
     
      //--------------------TEACHER MODULE--------------
      { url: '/addteacher', mwear: uploadProfileImage.any(),method: ctrls.teacherCtrl.addTeacher, type: 'post' },
      { url: '/addbulkteacher_csv', mwear: uploadTeacherCsv.any(),method: ctrls.teacherCtrl.addBulkTeacherInCsv, type: 'post' },
      { url: '/getteacher',method: ctrls.teacherCtrl.getTeacher, type: 'get' },
      { url: '/view_teacher',method: ctrls.teacherCtrl.viewTeacher, type: 'get' },
      { url: '/edit_teacher',mwear: uploadProfileImage.any(),method: ctrls.teacherCtrl.editTeacher, type: 'post' },
      { url: '/delete_teacher',method: ctrls.teacherCtrl.deleteTeacher, type: 'delete' },
      { url: '/assign_class_teacher',method: ctrls.teacherCtrl.assignClassToTeacher, type: 'post' },
      //--------------------STUDENT MODULE--------------
      { url: '/addstudent', mwear: uploadProfileImage.any(),method: ctrls.studentCtrl.addStudent, type: 'post' },
      { url: '/getstudent',method: ctrls.studentCtrl.getStudent, type: 'get' },
      { url: '/addbulkstudent_csv', mwear: uploadStudentCsv.any(),method: ctrls.studentCtrl.addBulkStudentInCsv, type: 'post' },
      { url: '/view_student',method: ctrls.studentCtrl.viewStudent, type: 'get' },
      { url: '/edit_student',mwear: uploadProfileImage.any(),method: ctrls.studentCtrl.editStudent, type: 'post' },
      { url: '/delete_student',method: ctrls.studentCtrl.deleteStudent, type: 'delete' },
      { url: '/get_student_listing',method: ctrls.studentCtrl.studentListing, type: 'get' },
      { url: '/assign_class_student',method: ctrls.studentCtrl.assignClassToStudent, type: 'post' },
      //----------------------CLASS MODULE---------------
      { url: '/add_class',method: ctrls.masterCtrl.addClass, type: 'post' },
      { url: '/get_class',method: ctrls.masterCtrl.getClassData, type: 'get' },
      { url: '/view_class',method: ctrls.masterCtrl.viewClass, type: 'get' },
      { url: '/edit_class',method: ctrls.masterCtrl.editClass, type: 'post' },
      { url: '/delete_class',method: ctrls.masterCtrl.deleteClass, type: 'delete' },
      { url: '/class_code_list',method: ctrls.masterCtrl.getClassCodeList, type: 'get' },

      //----------------------SECTION MODULE----------------
      { url: '/add_section',method: ctrls.masterCtrl.addSection, type: 'post' },
      { url: '/get_section',method: ctrls.masterCtrl.getSectionData, type: 'get' },
      { url: '/view_section',method: ctrls.masterCtrl.viewSection, type: 'get' },
      { url: '/edit_section',method: ctrls.masterCtrl.editSection, type: 'post' },
      { url: '/delete_section',method: ctrls.masterCtrl.deleteSection, type: 'delete' },
      
      //----------------------SUBJECT MODULE----------------
      { url: '/add_subject',method: ctrls.masterCtrl.addSubject, type: 'post' },
      { url: '/edit_subject',method: ctrls.masterCtrl.editSubject, type: 'post' },
      { url: '/view_subject',method: ctrls.masterCtrl.viewSubject, type: 'get' },
      { url: '/delete_subject',method: ctrls.masterCtrl.deleteSubject, type: 'delete' },
      { url: '/get_subject',method: ctrls.masterCtrl.getSubjectData, type: 'get' },

      //----------------------PARENT MODULE-----------------
      { url: '/add_parent', mwear: uploadProfileImage.any(),method: ctrls.parentCtrl.addParent, type: 'post' },
      { url: '/get_parent',method: ctrls.parentCtrl.getParent, type: 'get' },
      { url: '/view_parent',method: ctrls.parentCtrl.viewParent, type: 'get' },
      { url: '/edit_parent',mwear: uploadProfileImage.any(),method: ctrls.parentCtrl.editParent, type: 'post' },
      { url: '/delete_parent',method: ctrls.parentCtrl.deleteParent, type: 'delete' },
      { url: '/get_parent_listing',method: ctrls.parentCtrl.parentListing, type: 'get' },
      { url: '/link_parent_student',method: ctrls.linkParentStudentCtrl.linkParentStudent, type: 'post' }


  ]
};