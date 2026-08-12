import { ROOMSIZE } from "./room";
import { WORKNAME, normalizeWorkName } from "./work_";

// 이미지 에셋 (Vite: require -> import)
import _img_download from "../assets/imageset/download.png";
import _img_pclogo from "../assets/imageset/pclogo.png";
import _img_logogif from "../assets/imageset/logogif.gif";
import _img_init from "../assets/imageset/init.png";
import _img_enablecheck from "../assets/imageset/enablecheck.png";
import _img_disablecheck from "../assets/imageset/disablecheck.png";
import _img_search from "../assets/imageset/search.png";
import _img_info_circle from "../assets/imageset/info-circle.png";
import _img_redsearch from "../assets/imageset/redsearch.png";
import _img_logout from "../assets/imageset/logout.png";
import _img_user from "../assets/imageset/user.png";
import _img_PCSplash from "../assets/imageset/PCSplash.png";
import _img_MobileSplash from "../assets/imageset/MobileSplash.png";
import _img_Empty from "../assets/imageset/Empty.png";
import _img_tour from "../assets/imageset/tour.png";
import _img_tourcountry from "../assets/imageset/tourcountry.png";
import _img_medical from "../assets/imageset/medical.png";
import _img_food from "../assets/imageset/food.png";
import _img_convenience from "../assets/imageset/convenience.png";
import _img_board from "../assets/imageset/board.png";
import _img_performance from "../assets/imageset/performance.png";
import _img_expand from "../assets/imageset/expand.png";
import _img_success from "../assets/imageset/success.png";
import _img_warning from "../assets/imageset/warning.png";
import _img_fail from "../assets/imageset/fail.png";
import _img_dot from "../assets/imageset/dot.png";
import _img_heartoff from "../assets/imageset/heartoff.png";
import _img_person from "../assets/imageset/person.png";
import _img_logo from "../assets/imageset/logo.png";
import _img_logo2 from "../assets/imageset/logo2.png";
import _img_honglogo from "../assets/imageset/honglogo.png";
import _img_uploadenable from "../assets/imageset/uploadenable.png";
import _img_uploaddisable from "../assets/imageset/uploaddisable.png";
import _img_mobilebanner1 from "../assets/imageset/mobilebanner1.png";
import _img_mobilebanner2 from "../assets/imageset/mobilebanner2.png";
import _img_mobilebanner3 from "../assets/imageset/mobilebanner3.png";
import _img_mobilebanner4 from "../assets/imageset/mobilebanner4.png";
import _img_mobilebanner5 from "../assets/imageset/mobilebanner5.png";
import _img_mobilebanner6 from "../assets/imageset/mobilebanner6.png";
import _img_mobilebanner7 from "../assets/imageset/mobilebanner7.png";
import _img_mobilebanner8 from "../assets/imageset/mobilebanner8.png";
import _img_mobilebanner9 from "../assets/imageset/mobilebanner9.png";
import _img_mobilebanner10 from "../assets/imageset/mobilebanner10.png";
import _img_mobilebanner11 from "../assets/imageset/mobilebanner11.png";
import _img_roomplus from "../assets/imageset/roomplus.png";
import _img_movegps from "../assets/imageset/movegps.png";
import _img_movegps_2 from "../assets/imageset/movegps.gif";
import _img_check_d from "../assets/imageset/check_d.png";
import _img_check_e from "../assets/imageset/check_e.png";
import _img_filter from "../assets/imageset/filter.png";
import _img_filterblack from "../assets/imageset/filterblack.png";
import _img_reset from "../assets/imageset/reset.png";
import _img_memo from "../assets/imageset/memo.png";
import _img_enablememo from "../assets/imageset/enablememo.png";
import _img_Up from "../assets/imageset/Up.png";
import _img_drug from "../assets/imageset/drug.png";
import _img_healthfood from "../assets/imageset/healthfood.png";
import _img_camping from "../assets/imageset/camping.png";
import _img_loading from "../assets/imageset/loading.json";
import _img_loadinglarge from "../assets/imageset/loadinglarge.json";
import _img_pin_h from "../assets/imageset/pin_h.json";
import _img_selection_d from "../assets/imageset/selection_d.png";
import _img_selection_e from "../assets/imageset/selection_e.png";
import _img_roomsample1 from "../assets/imageset/roomsample1.png";
import _img_roomsample2 from "../assets/imageset/roomsample2.png";
import _img_roomsample3 from "../assets/imageset/roomsample3.png";
import _img_roomsample4 from "../assets/imageset/roomsample4.png";
import _img_roomsample5 from "../assets/imageset/roomsample5.png";
import _img_roomsample6 from "../assets/imageset/roomsample6.png";
import _img_roomsample7 from "../assets/imageset/roomsample7.png";
import _img_roomsample8 from "../assets/imageset/roomsample8.png";
import _img_roomsize1 from "../assets/imageset/roomsize1.png";
import _img_roomsize2 from "../assets/imageset/roomsize2.png";
import _img_roomsize3 from "../assets/imageset/roomsize3.png";
import _img_roomsize4 from "../assets/imageset/roomsize4.png";
import _img_roomsize5 from "../assets/imageset/roomsize5.png";
import _img_roomsize6 from "../assets/imageset/roomsize6.png";
import _img_sample1 from "../assets/imageset/sample1.png";
import _img_sample2 from "../assets/imageset/sample2.png";
import _img_sample3 from "../assets/imageset/sample3.png";
import _img_sample4 from "../assets/imageset/sample4.png";
import _img_sample5 from "../assets/imageset/sample5.png";
import _img_sample6 from "../assets/imageset/sample6.png";
import _img_sample7 from "../assets/imageset/sample7.png";
import _img_sample8 from "../assets/imageset/sample8.png";
import _img_sample9 from "../assets/imageset/sample9.png";
import _img_sample10 from "../assets/imageset/sample10.png";
import _img_sample11 from "../assets/imageset/sample11.gif";
import _img_sample12 from "../assets/imageset/sample12.gif";
import _img_sample13 from "../assets/imageset/sample13.gif";
import _img_sample14 from "../assets/imageset/sample14.gif";
import _img_sample14_new from "../assets/imageset/sample14_new.gif";
import _img_sample15 from "../assets/imageset/sample15.png";
import _img_sample16 from "../assets/imageset/sample16.png";
import _img_sample17 from "../assets/imageset/sample17.png";
import _img_sample18 from "../assets/imageset/sample18.png";
import _img_sample19 from "../assets/imageset/sample19.gif";
import _img_sample20 from "../assets/imageset/sample20.gif";
import _img_sample21 from "../assets/imageset/sample21.gif";
import _img_sample22 from "../assets/imageset/sample22.gif";
import _img_sample23 from "../assets/imageset/sample23.gif";
import _img_sample24 from "../assets/imageset/sample24.gif";
import _img_sample25 from "../assets/imageset/sample25.png";
import _img_sample26 from "../assets/imageset/sample26.png";
import _img_sample27 from "../assets/imageset/sample27.png";
import _img_sample29 from "../assets/imageset/sample29.png";
import _img_sample30 from "../assets/imageset/sample30.gif";
import _img_sample31 from "../assets/imageset/sample31.gif";
import _img_sample32 from "../assets/imageset/sample32.gif";
import _img_sample33 from "../assets/imageset/sample33.png";
import _img_logotext from "../assets/imageset/logotext.png";
import _img_sample35 from "../assets/imageset/sample35.png";
import _img_sample36 from "../assets/imageset/sample36.png";
import _img_sample37 from "../assets/imageset/sample37.png";
import _img_search_2 from "../assets/imageset/search.gif";
import _img_sample38 from "../assets/imageset/sample38.png";
import _img_sample39 from "../assets/imageset/sample39.png";
import _img_license from "../assets/imageset/license.png";
import _img_communitylist1 from "../assets/imageset/communitylist1.png";
import _img_communitylist2 from "../assets/imageset/communitylist2.png";
import _img_communitylist3 from "../assets/imageset/communitylist3.png";
import _img_communitylist4 from "../assets/imageset/communitylist4.png";
import _img_communitylist5 from "../assets/imageset/communitylist5.png";
import _img_communitylist6 from "../assets/imageset/communitylist6.png";
import _img_communitylist7 from "../assets/imageset/communitylist7.png";
import _img_communitylist8 from "../assets/imageset/communitylist8.png";
import _img_communitylist9 from "../assets/imageset/communitylist9.png";
import _img_communitylist10 from "../assets/imageset/communitylist10.png";
import _img_communitylist11 from "../assets/imageset/communitylist11.png";
import _img_communitylist12 from "../assets/imageset/communitylist12.png";
import _img_communitylist13 from "../assets/imageset/communitylist13.png";
import _img_close from "../assets/imageset/close.png";
import _img_close2 from "../assets/imageset/close2.png";
import _img_bell from "../assets/imageset/bell.png";
import _img_hongmove from "../assets/imageset/hongmove.png";
import _img_hongmain from "../assets/imageset/hongmain.png";
import _img_house from "../assets/imageset/house.png";
import _img_housesmall from "../assets/imageset/housesmall.png";
import _img_housegray from "../assets/imageset/housegray.png";
import _img_housegraysmall from "../assets/imageset/housegraysmall.png";
import _img_business from "../assets/imageset/business.png";
import _img_businesssmall from "../assets/imageset/businesssmall.png";
import _img_businessgray from "../assets/imageset/businessgray.png";
import _img_businessgraysmall from "../assets/imageset/businessgraysmall.png";
import _img_move from "../assets/imageset/move.png";
import _img_movesmall from "../assets/imageset/movesmall.png";
import _img_movegray from "../assets/imageset/movegray.png";
import _img_movegraysmall from "../assets/imageset/movegraysmall.png";
import _img_cook from "../assets/imageset/cook.png";
import _img_cooksmall from "../assets/imageset/cooksmall.png";
import _img_cookgray from "../assets/imageset/cookgray.png";
import _img_cookgraysmall from "../assets/imageset/cookgraysmall.png";
import _img_help from "../assets/imageset/help.png";
import _img_helpsmall from "../assets/imageset/helpsmall.png";
import _img_helpgray from "../assets/imageset/helpgray.png";
import _img_helpgraysmall from "../assets/imageset/helpgraysmall.png";
import _img_gooutschool from "../assets/imageset/gooutschool.png";
import _img_gooutschoolsmall from "../assets/imageset/gooutschoolsmall.png";
import _img_gooutschoolgray from "../assets/imageset/gooutschoolgray.png";
import _img_gooutschoolgraysmall from "../assets/imageset/gooutschoolgraysmall.png";
import _img_hospital from "../assets/imageset/hospital.png";
import _img_hospitalsmall from "../assets/imageset/hospitalsmall.png";
import _img_hospitalgray from "../assets/imageset/hospitalgray.png";
import _img_hospitalgraysmall from "../assets/imageset/hospitalgraysmall.png";
import _img_babycare from "../assets/imageset/babycare.png";
import _img_babycaresmall from "../assets/imageset/babycaresmall.png";
import _img_babycaregray from "../assets/imageset/babycaregray.png";
import _img_babycaregraysmall from "../assets/imageset/babycaregraysmall.png";
import _img_carry from "../assets/imageset/carry.png";
import _img_carrysmall from "../assets/imageset/carrysmall.png";
import _img_carrygray from "../assets/imageset/carrygray.png";
import _img_carrygraysmall from "../assets/imageset/carrygraysmall.png";
import _img_patientcare from "../assets/imageset/patientcare.png";
import _img_patientcaresmall from "../assets/imageset/patientcaresmall.png";
import _img_patientcaregray from "../assets/imageset/patientcaregray.png";
import _img_patientcaregraysmall from "../assets/imageset/patientcaregraysmall.png";
import _img_recipe from "../assets/imageset/recipe.png";
import _img_recipesmall from "../assets/imageset/recipesmall.png";
import _img_recipegray from "../assets/imageset/recipegray.png";
import _img_recipegraysmall from "../assets/imageset/recipegraysmall.png";
import _img_schoolevent from "../assets/imageset/schoolevent.png";
import _img_schooleventsmall from "../assets/imageset/schooleventsmall.png";
import _img_schooleventgray from "../assets/imageset/schooleventgray.png";
import _img_schooleventgraysmall from "../assets/imageset/schooleventgraysmall.png";
import _img_dog from "../assets/imageset/dog.png";
import _img_dogsmall from "../assets/imageset/dogsmall.png";
import _img_doggray from "../assets/imageset/doggray.png";
import _img_doggraysmall from "../assets/imageset/doggraysmall.png";
import _img_doghospital from "../assets/imageset/doghospital.png";
import _img_doghospitalsmall from "../assets/imageset/doghospitalsmall.png";
import _img_doghospitalgray from "../assets/imageset/doghospitalgray.png";
import _img_doghospitalgraysmall from "../assets/imageset/doghospitalgraysmall.png";
import _img_shopping from "../assets/imageset/shopping.png";
import _img_shoppingsmall from "../assets/imageset/shoppingsmall.png";
import _img_shoppinggray from "../assets/imageset/shoppinggray.png";
import _img_shoppinggraysmall from "../assets/imageset/shoppinggraysmall.png";
import _img_lesson from "../assets/imageset/lesson.png";
import _img_lessonsmall from "../assets/imageset/lessonsmall.png";
import _img_lessongray from "../assets/imageset/lessongray.png";
import _img_lessongraysmall from "../assets/imageset/lessongraysmall.png";
import _img_map8 from "../assets/imageset/map8.png";
import _img_map9 from "../assets/imageset/map9.png";
import _img_eye_solid from "../assets/imageset/eye-solid.png";
import _img_rulletstart from "../assets/imageset/rulletstart.png";
import _img_rulletpin from "../assets/imageset/rulletpin.png";
import _img_rulletsuccess from "../assets/imageset/rulletsuccess.gif";
import _img_map from "../assets/imageset/map.png";
import _img_map_pin from "../assets/imageset/map-pin.png";
import _img_distance from "../assets/imageset/distance.png";
import _img_home_e from "../assets/imageset/home_e.png";
import _img_home_d from "../assets/imageset/home_d.png";
import _img_room_e from "../assets/imageset/room_e.png";
import _img_room_d from "../assets/imageset/room_d.png";
import _img_community_e from "../assets/imageset/community_e.png";
import _img_community_d from "../assets/imageset/community_d.png";
import _img_myinfo_e from "../assets/imageset/myinfo_e.png";
import _img_gps_e from "../assets/imageset/gps_e.png";
import _img_gps_d from "../assets/imageset/gps_d.png";
import _img_myinfo_d from "../assets/imageset/myinfo_d.png";

export const imageDB = {
  download: _img_download,
  pclogo: _img_pclogo,
  logogif: _img_logogif,
  init : _img_init,
  enablecheck: _img_enablecheck,
  disablecheck: _img_disablecheck,
  search: _img_search,
  infocircle: _img_info_circle,
  redsearch: _img_redsearch,
  logout: _img_logout,
  user: _img_user,
  pcslpash: _img_PCSplash,
  mobileslpash: _img_MobileSplash,
  Empty : _img_Empty,
  tour: _img_tour,
  tourcountry: _img_tourcountry,
  medical: _img_medical,
  food: _img_food,
  convenience: _img_convenience,
  board: _img_board,
  performance: _img_performance,
  expand: _img_expand,
  success: _img_success,
  warning: _img_warning,
  fail: _img_fail,
  dot : _img_dot,
  heartoff: _img_heartoff,

  person : _img_person,
  logo: _img_logo,
  logo2: _img_logo2,
  honglogo : _img_honglogo,
  uploadenable : _img_uploadenable,
  uploaddisable : _img_uploaddisable,
  mobilebanner1 :_img_mobilebanner1,
  mobilebanner2 :_img_mobilebanner2,
  mobilebanner3 :_img_mobilebanner3,
  mobilebanner4 :_img_mobilebanner4,
  mobilebanner5 :_img_mobilebanner5,
  mobilebanner6 :_img_mobilebanner6,
  mobilebanner7 :_img_mobilebanner7,
  mobilebanner8 :_img_mobilebanner8,
  mobilebanner9 :_img_mobilebanner9,
  mobilebanner10 :_img_mobilebanner10,
  mobilebanner11 :_img_mobilebanner11,
  roomplus :_img_roomplus,
  movegps :_img_movegps,
  movegpsex :_img_movegps_2,
  check_d:_img_check_d,
  check_e:_img_check_e,
  enablecheck:_img_enablecheck,
  filter:_img_filter,
  filterblack:_img_filterblack,
  reset:_img_reset,
  memo:_img_memo,
  enablememo:_img_enablememo,
  Up:_img_Up,
  drug :_img_drug,
  healthfood :_img_healthfood,
  camping :_img_camping,
  loading :_img_loading,
  loadinglarge :_img_loadinglarge,
  pinmove :_img_pin_h,
  gps :_img_movegps,
  selection_d :_img_selection_d,
  selection_e :_img_selection_e,
  roomsample1: _img_roomsample1,
  roomsample2: _img_roomsample2,
  roomsample3: _img_roomsample3,
  roomsample4: _img_roomsample4,
  roomsample5: _img_roomsample5,
  roomsample6: _img_roomsample6,
  roomsample7: _img_roomsample7,
  roomsample8: _img_roomsample8,

  roomsize1: _img_roomsize1,
  roomsize2: _img_roomsize2,
  roomsize3: _img_roomsize3,
  roomsize4: _img_roomsize4,
  roomsize5: _img_roomsize5,
  roomsize6: _img_roomsize6,



  sample1: _img_sample1,
  sample2: _img_sample2,
  sample3: _img_sample3,
  sample4: _img_sample4,
  sample5: _img_sample5,
  sample6: _img_sample6,
  sample7: _img_sample7,
  sample8: _img_sample8,
  sample9: _img_sample9,
  sample10: _img_sample10,
  sample11: _img_sample11,
  sample12: _img_sample12,
  sample13: _img_sample13,
  sample14: _img_sample14,
  sample14_new: _img_sample14_new,
  sample15: _img_sample15,
  sample16: _img_sample16,
  sample17: _img_sample17,
  sample18: _img_sample18,
  sample19: _img_sample19,
  sample20: _img_sample20,
  sample21: _img_sample21,
  sample22: _img_sample22,
  sample23: _img_sample23,
  sample24: _img_sample24,
  sample25: _img_sample25,
  sample26: _img_sample26,
  sample27: _img_sample27,
  sample28: _img_sample23,
  sample29: _img_sample29,
  sample30: _img_sample30,
  sample31: _img_sample31,
  sample32: _img_sample32,
  sample33: _img_sample33,
  sample34: _img_logotext,
  sample35: _img_sample35,
  sample36: _img_sample36,
  sample37: _img_sample37,
  searchgif : _img_search_2,
  sample38: _img_sample38,
  sample39: _img_sample39,
  license: _img_license,

  communitylist1: _img_communitylist1,
  communitylist2: _img_communitylist2,
  communitylist3: _img_communitylist3,
  communitylist4: _img_communitylist4,
  communitylist5: _img_communitylist5,
  communitylist6: _img_communitylist6,
  communitylist7: _img_communitylist7,
  communitylist8: _img_communitylist8,
  communitylist9: _img_communitylist9,
  communitylist10: _img_communitylist10,
  communitylist11: _img_communitylist11,
  communitylist12: _img_communitylist12,
  communitylist13: _img_communitylist13,


  close: _img_close,
  close2: _img_close2,
  bell: _img_bell,
  hongmoveicon: _img_hongmove,
  hongmainicon: _img_hongmain,
  house: _img_house,
  housesmall: _img_housesmall,
  housegray: _img_housegray,
  housegraysmall: _img_housegraysmall,
  business: _img_business,
  businesssmall: _img_businesssmall,
  businessgray: _img_businessgray,
  businessgraysmall: _img_businessgraysmall,
  move: _img_move,
  movesmall: _img_movesmall,
  movegray: _img_movegray,
  movegraysmall: _img_movegraysmall,
  cook: _img_cook,
  cooksmall: _img_cooksmall,
  cookgray: _img_cookgray,
  cookgraysmall: _img_cookgraysmall,
  help:_img_help,
  helpsmall:_img_helpsmall,
  helpgray:_img_helpgray,
  helpgraysmall:_img_helpgraysmall,
  gooutschool: _img_gooutschool,
  gooutschoolsmall: _img_gooutschoolsmall,
  gooutschoolgray: _img_gooutschoolgray,
  gooutschoolgraysmall: _img_gooutschoolgraysmall,
  hospital: _img_hospital,
  hospitalsmall: _img_hospitalsmall,
  hospitalgray: _img_hospitalgray,
  hospitalgraysmall: _img_hospitalgraysmall,
  babycare: _img_babycare,
  babycaresmall: _img_babycaresmall,
  babycaregray: _img_babycaregray,
  babycaregraysmall: _img_babycaregraysmall,
  carry: _img_carry,
  carrysmall: _img_carrysmall,
  carrygray: _img_carrygray,
  carrygraysmall: _img_carrygraysmall,
  patientcare : _img_patientcare,
  patientcaresmall : _img_patientcaresmall,
  patientcaregray : _img_patientcaregray,
  patientcaregraysmall : _img_patientcaregraysmall,
  recipe: _img_recipe,
  recipesmall: _img_recipesmall,
  recipegray: _img_recipegray,
  recipegraysmall: _img_recipegraysmall,
  schoolevent : _img_schoolevent,
  schooleventsmall : _img_schooleventsmall,
  schooleventgray : _img_schooleventgray,
  schooleventgraysmall : _img_schooleventgraysmall,
  dog : _img_dog,
  dogsmall : _img_dogsmall,
  doggray : _img_doggray,
  doggraysmall : _img_doggraysmall,
  doghospital : _img_doghospital,
  doghospitalsmall : _img_doghospitalsmall,
  doghospitalgray : _img_doghospitalgray,
  doghospitalgraysmall : _img_doghospitalgraysmall,
  shopping : _img_shopping,
  shoppingsmall : _img_shoppingsmall,
  shoppinggray : _img_shoppinggray,
  shoppinggraysmall : _img_shoppinggraysmall,
  lesson : _img_lesson,
  lessonsmall : _img_lessonsmall,
  lessongray : _img_lessongray,
  lessongraysmall : _img_lessongraysmall,
  map8: _img_map8,
  map9: _img_map9,
  eyesolid : _img_eye_solid,
  rulletstart : _img_rulletstart,
  rulletpin : _img_rulletpin,
  rulletsuccess : _img_rulletsuccess,
  map : _img_map,
  mappin : _img_map_pin,
  distance : _img_distance,

  home_e :_img_home_e,
  home_d :_img_home_d,
  room_e :_img_room_e,
  room_d :_img_room_d,
  community_e :_img_community_e,
  community_d :_img_community_d,
  map_e :_img_gps_e,
  map_d :_img_gps_d,
  myinfo_e :_img_myinfo_e,
  myinfo_d :_img_myinfo_d,

};



export const Seekimage = (category) =>{
  category = normalizeWorkName(category);
  if(category == WORKNAME.ALLWORK){
    return imageDB.pclogo;
  }
  if(category == WORKNAME.HOMECLEAN){
    return imageDB.house;
  }else if(category == WORKNAME.BUSINESSCLEAN){
    return imageDB.business;
  }else if(category == WORKNAME.MOVECLEAN){
    return imageDB.move;
  }else if(category == WORKNAME.FOODPREPARE){
    return imageDB.cook;
  }else if(category == WORKNAME.GOOUTSCHOOL){
    return imageDB.gooutschool;
  }else if(category == WORKNAME.BABYCARE){
    return imageDB.babycare;
  }else if(category == WORKNAME.ERRAND){
    return imageDB.help;
  }else if(category == WORKNAME.PATIENTCARE){
    return imageDB.patientcare;
  }else if(category == WORKNAME.CARRYLOAD){
    return imageDB.carry;
  }else if(category == WORKNAME.GOHOSPITAL){
    return imageDB.hospital;
  }else if(category == WORKNAME.GOSCHOOLEVENT){
    return imageDB.schoolevent;
  }else if(category == WORKNAME.SHOPPING){
    return imageDB.shopping;
  }else if(category == WORKNAME.GODOGHOSPITAL){
    return imageDB.doghospital;
  }else if(category == WORKNAME.GODOGWALK){
    return imageDB.dog;
  }else if(category == WORKNAME.LESSON){
    return imageDB.lesson;
  }else if(category == ROOMSIZE.SMALLER){
    return imageDB.roomsize1;
  }else if(category == ROOMSIZE.SMALL){
    return imageDB.roomsize2;
  }else if(category == ROOMSIZE.MEDIUM){
    return imageDB.roomsize3;
  }else if(category == ROOMSIZE.LARGE){
    return imageDB.roomsize4;
  }else if(category == ROOMSIZE.EXLARGE){
    return imageDB.roomsize5;
  }
}
export const Seekgrayimage = (category) =>{
  category = normalizeWorkName(category);
  if(category == WORKNAME.ALLWORK){
    return imageDB.pclogo;
  }
  if(category == WORKNAME.HOMECLEAN){
    return imageDB.housegray;
  }else if(category == WORKNAME.BUSINESSCLEAN){
    return imageDB.businessgray;
  }else if(category == WORKNAME.MOVECLEAN){
    return imageDB.movegray;
  }else if(category == WORKNAME.FOODPREPARE){
    return imageDB.cookgray;
  }else if(category == WORKNAME.GOOUTSCHOOL){
    return imageDB.gooutschoolgray;
  }else if(category == WORKNAME.BABYCARE){
    return imageDB.babycaregray;
  }else if(category == WORKNAME.ERRAND){
    return imageDB.helpgray;
  }else if(category == WORKNAME.PATIENTCARE){
    return imageDB.patientcaregray;
  }else if(category == WORKNAME.CARRYLOAD){
    return imageDB.carrygray;
  }else if(category == WORKNAME.GOHOSPITAL){
    return imageDB.hospitalgray;
  }else if(category == WORKNAME.GOSCHOOLEVENT){
    return imageDB.schooleventgray;
  }else if(category == WORKNAME.SHOPPING){
    return imageDB.shoppinggray;
  }else if(category == WORKNAME.GODOGHOSPITAL){
    return imageDB.doghospitalgray;
  }else if(category == WORKNAME.GODOGWALK){
    return imageDB.doggray;
  }else if(category == WORKNAME.LESSON){
    return imageDB.lessongray;
  }else if(category == ROOMSIZE.SMALLER){
    return imageDB.roomsize1;
  }else if(category == ROOMSIZE.SMALL){
    return imageDB.roomsize2;
  }else if(category == ROOMSIZE.MEDIUM){
    return imageDB.roomsize3;
  }else if(category == ROOMSIZE.LARGE){
    return imageDB.roomsize4;
  }else if(category == ROOMSIZE.LARGER){
    return imageDB.roomsize5;
  }else if(category == ROOMSIZE.EXLARGE){
    return imageDB.roomsize6;
  }
}


