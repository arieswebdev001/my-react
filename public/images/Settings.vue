<template>
    <div>
        <div v-if="user.level!==0 && gate(user,'settings', 'view')" class="row">
            <div class="col-md-9">
                <div class="portlet light" style="padding-top:12px;">
                    <div class="portlet-title tabbable-line">
                        <div class="caption">
                            <i class="icon-bubbles font-dark hide"></i>
                            <span class="caption-subject font-dark bold uppercase">Settings</span>
                        </div>
                        <ul class="nav nav-tabs">
                            <li class="active">
                                <a href="#settings" data-toggle="tab"> Settings </a>
                            </li>
                            <li>
                                <a href="#users" data-toggle="tab" v-if="gate(user,'users','view')"> Users </a>
                            </li>
                            <li>
                                <a href="#levels" data-toggle="tab" v-if="gate(user,'users','view')"> Levels </a>
                            </li>
                        </ul>
                    </div>
                    <div class="portlet-body">
                        <div class="tab-content">
                            <div class="tab-pane active" id="settings">
                                <vue-good-table :rows="settings" 
                                    :columns="settingsTable.columns" 
                                    :pagination-options="{
                                        enabled: true,
                                    }"
                                    @on-row-click="viewSettings"
                                    />

                                <div id="setting-modal" class="modal fade" tabindex="-1" data-backdrop="static" data-keyboard="false" style="display: none;">
                                    <div class="modal-dialog modal-sm">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                                                <h4 class="modal-title">Update Setting</h4>
                                            </div>
                                            <div class="modal-body" v-if="setting.id !== undefined">
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <div class="form-group">
                                                            <label>{{ setting.config_name }}</label>
                                                            <input type="number" v-if="setting.config_type === 'number'" v-model.number="setting.config_value" class="form-control"/>
                                                            <input type="text" v-else-if="setting.config_type === 'text'" v-model="setting.config_value" class="form-control"/>
                                                            <div v-else-if="setting.config_type === 'array'">
                                                                <table class="table table-condensed table-bordered">
                                                                    <tbody>
                                                                        <tr v-for="e,k in setting.config_value">
                                                                            <td>
                                                                                <input type="text" v-model="setting.config_value[k]" class="form-control" />
                                                                            </td>
                                                                            <td>
                                                                                <button class="btn btn-xs btn-danger" @click="removeItem(k)">X</button>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td></td>
                                                                            <td>
                                                                                <button class="btn btn-xs btn-info" @click="addItem">+</button>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                            <span v-if="setting.config_type==='boolean'">
                                                                <br/>
                                                                <toggle-button :width="150" v-model="setting.config_value" :sync="true" :labels="{checked: 'Yes', unchecked: 'No'}"/>
                                                                <br/>
                                                            </span>
                                                            <small> {{ setting.config_description }} </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" data-dismiss="modal" class="btn dark btn-outline">Close</button>
                                                <button type="button" @click="saveSetting" class="btn btn-success">Save</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane" id="users">
                                <button type="button" @click="showUserModal" class="btn btn-info" v-if="gate(user,'users','add')">Add User</button>
                                <vue-good-table :rows="users" 
                                    :columns="usersTable.columns" 
                                    :pagination-options="{
                                        enabled: true,
                                    }"
                                    @on-row-click="viewUser"
                                    />

                                <div id="user-modal" class="modal fade" tabindex="-1" data-backdrop="static" data-keyboard="false" style="display: none;">
                                    <div class="modal-dialog modal-lg">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                                                <h4 class="modal-title" v-if="newUser.id === 0">Add User</h4>
                                                <h4 class="modal-title" v-else>Update User</h4>
                                            </div>
                                            <div class="modal-body">
                                                <div class="row">
                                                    <div class="col-md-4">
                                                        <div class="form-group">
                                                            <label class="required">* First Name</label>
                                                            <input type="text" v-model="newUser.first_name" class="form-control"/>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-4">
                                                        <div class="form-group">
                                                            <label>Middle Name</label>
                                                            <input type="text" v-model="newUser.middle_name" class="form-control"/>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-4">
                                                        <div class="form-group">
                                                            <label class="required">* Last Name</label>
                                                            <input type="text" v-model="newUser.last_name" class="form-control"/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-3">
                                                        <div class="form-group">
                                                            <label class="required">* Gender</label>
                                                            <select class="form-control" v-model="newUser.gender">
                                                                <option value="male">Male</option>
                                                                <option value="female">Female</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <div class="form-group">
                                                            <label>Telephone No.</label>
                                                            <input type="text" v-model="newUser.telephone" class="form-control"/>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <div class="form-group">
                                                            <label class="required">* Mobile No.</label>
                                                            <masked-input mask="\+\6\31111111111" placeholder="Phone" v-model="newUser.mobile" class="form-control"/>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <div class="form-group">
                                                            <label>Fax No.</label>
                                                            <input type="text" v-model="newUser.fax" class="form-control"/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-3">
                                                        <div class="form-group">
                                                            <label class="required">* Date of Birth</label>
                                                            <input type="date" v-model="newUser.birth_date" class="form-control"/>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <div class="form-group">
                                                            <label> Place of Birth</label>
                                                            <input type="text" v-model="newUser.birth_place" class="form-control"/>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <div class="form-group">
                                                            <label class="required">* Civil Status</label>
                                                            <select class="form-control" v-model="newUser.civil_status">
                                                                <option value="single">Single</option>
                                                                <option value="married">Married</option>
                                                                <option value="widow">Widow</option>
                                                                <option value="separated">Separated</option>
                                                                <option value="divorced">Divorced</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <div class="form-group" >
                                                            <label>Password</label>
                                                            <input type="password" v-model="newUser.password" class="form-control"/>
                                                            <small v-if="newUser.id === 0">** If not provided, default password would be: 123456</small>
                                                            <small  v-if="newUser.password !== '' && newUser.id !== 0">Password will be updated.</small>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-3">
                                                        <div class="form-group">
                                                            <label class="required">* Email</label>
                                                            <input type="text" v-model="newUser.email" class="form-control"/>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-9">
                                                        <div class="form-group">
                                                            <label>Home Address</label>
                                                            <input type="text" v-model="newUser.address" class="form-control"/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-3">
                                                        <div class="form-group">
                                                            <label class="required">* Level</label>
                                                            <select class="form-control" v-model="newUser.level">
                                                                <option :value="level.id" v-for="level,key in levels">{{ level.level_name }}</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-9">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" data-dismiss="modal" class="btn dark btn-outline">Close</button>
                                                <button type="button" @click="saveUser($event)" class="btn btn-success">Save</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div class="tab-pane" id="levels">
                                <button type="button" @click="showLevelModal" class="btn btn-info" v-if="gate(user,'users','add')">Add Level</button>
                                <vue-good-table :rows="levels" 
                                    :columns="levelsTable.columns" 
                                    :pagination-options="{
                                        enabled: true,
                                    }"
                                    @on-row-click="viewLevel"
                                    />

                                <div id="level-modal" class="modal fade" tabindex="-1" data-backdrop="static" data-keyboard="false" style="display: none;">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                                                <h4 class="modal-title" v-if="level.id === 0">Add User Level</h4>
                                                <h4 class="modal-title" v-else>Update User Level</h4>
                                            </div>
                                            <div class="modal-body">
                                                <div class="row">
                                                    <div class="col-md-4">
                                                        <div class="form-group">
                                                            <label class="control-label">Level Name</label>
                                                            <input type="text" v-model="level.level_name" class="form-control" />
                                                        </div>
                                                    </div>
                                                    <div class="col-md-8">
                                                        <div class="form-group">
                                                            <label class="control-label">Description</label>
                                                            <input type="text" v-model="level.description" placeholder="(Optional)" class="form-control" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <h4>User Access</h4>
                                                <table class="table table-condensed table-bordered table-hover table-striped"
                                                    v-if="level.level_data !== undefined">
                                                    <tbody>
                                                    <tr v-for="p,key in permissions">
                                                        <th>{{ p.name }}</th>
                                                        <td>
                                                            <span v-for="a,k in p.actions">
                                                                <label>
                                                                    <input type="checkbox" v-model="level.level_data[p.name]" :value="a"/>
                                                                    {{ a }} &nbsp;
                                                                </label>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" data-dismiss="modal" class="btn dark btn-outline">Close</button>
                                                <button type="button" @click="addUserLevel($event)" v-if="level.id===0" class="btn btn-success">Save</button>
                                                <button type="button" @click="updateUserLevel($event)" v-else class="btn btn-success">Save</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="portlet light" v-if="gate(user,'sms_status','view')">
                    <div class="portlet-title">
                        <div class="caption">
                            <i class="icon-bubbles font-dark hide"></i>
                            <span class="caption-subject font-dark bold uppercase">SMS Settings</span>
                        </div>
                    </div>
                    <div class="portlet-body">
                        <h4> Credits: {{ sms_credits }}</h4>
                        <button class="btn btn-info btn-block" @click="getCredits($event)">Refresh Credits</button>
                        <div v-if="gate(user,'sms_status','update')">
                            <h4> SMS Enabled: </h4>
                            <toggle-button :width="150" v-model="sms_enabled" @change="changeSMSSetting" :sync="true" :labels="{checked: 'Yes', unchecked: 'No'}"/>
                        </div>
                    </div>
                </div>
                <div class="portlet light" v-if="gate(user,'logo_and_icon','view')">
                    <div class="portlet-title">
                        <div class="caption">
                            <i class="icon-bubbles font-dark hide"></i>
                            <span class="caption-subject font-dark bold uppercase">Logo and Icon</span>
                        </div>
                    </div>
                    <div class="portlet-body">
                        <button class="btn btn-info btn-block" :disabled="!gate(user,'logo_and_icon','update')" @click="showLogoModal">Change Logo</button>
                        <button class="btn btn-info btn-block" :disabled="!gate(user,'logo_and_icon','update')" @click="showIconModal">Change Site Icon</button>
                    </div>
                </div>
            </div>
        </div>
        <not-allowed-error v-else/>

        <div id="logo-modal" class="modal fade" tabindex="-1" data-backdrop="static" data-keyboard="false" style="display: none;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                        <h4 class="modal-title">Change Logo</h4>
                    </div>
                    <div class="modal-body">
                        <croppie
                            input_id="photo"
                            form_id="photo"
                            :owner_id="1"
                            @result="mountImage"
                            croppie_id="photo"
                            :width="287"
                            :height="135"
                        />
                    </div>
                    <div class="modal-footer">
                        <button type="button" data-dismiss="modal" class="btn dark btn-outline">Close</button>
                        <button type="button" @click="saveLogo" class="btn btn-success">Save</button>
                    </div>
                </div>
            </div>
        </div>
        <div id="icon-modal" class="modal fade" tabindex="-1" data-backdrop="static" data-keyboard="false" style="display: none;">
            <div class="modal-dialog ">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                        <h4 class="modal-title">Change Site Icon</h4>
                    </div>
                    <div class="modal-body">
                        <croppie
                            input_id="photo1"
                            form_id="photo1"
                            :owner_id="1"
                            @result="mountIcon"
                            croppie_id="photo1"
                            :width="32"
                            :height="32"
                        />
                    </div>
                    <div class="modal-footer">
                        <button type="button" data-dismiss="modal" class="btn dark btn-outline">Close</button>
                        <button type="button" @click="saveIcon" class="btn btn-success">Save</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {VueGoodTable} from 'vue-good-table';
import NotAllowedError from './errors/NotAllowedError.vue';
import Croppie from './ui/Croppie.vue';
import MaskedInput from 'vue-masked-input' 
export default {
    name: 'Settings',
    components:{ NotAllowedError, VueGoodTable, Croppie, MaskedInput },
    data () {
        return {
            logo:"",
            icon:"",
            sms_settings_fresh:true,
            sms_credits:0,
            settings:[],
            users:[],
            levels:[],
            newUser:{},
            level:{},
            setting:{},
            sms_enabled:true,
            permissions:[],
            settingsTable:{
                 columns: [
                    {
                        field: "config_name", 
                        label:"Config Name", 
                    },
                    {
                        field: "config_description", 
                        label:"Description", 
                    },
                    {
                        field: "config_value", 
                        label:"Value", 
                    },
                    {
                        field: "config_category", 
                        label:"Category",  
                    },
                    {
                        field: "config_type", 
                        label:"Type",  
                    },
                ]
            },
            usersTable:{
                 columns: [
                    {
                        field: "name", 
                        label:"Name", 
                    },
                    {
                        field: "email", 
                        label:"Email", 
                    },
                    {
                        field: "mobile", 
                        label:"Mobile", 
                    },
                    {
                        field: "address", 
                        label:"Address",  
                    },
                    {
                        field: "level_name", 
                        label:"Level",  
                    }
                ]
            },
            levelsTable:{
                 columns: [
                    {
                        field: "level_name", 
                        label:"Level Name", 
                    },
                    {
                        field: "description", 
                        label:"Description", 
                    }
                ]
            }
        }
    },
    methods:{
        showLevelModal(){
            this.level = {
                id:0,
                level_name:'',
                description:'',
                level_data:{
                    permissions:{}
                }
            };
            let u = this;
            this.permissions.forEach((item)=>{
                u.level.level_data.permissions[item.name] = [];
            });

            $("#level-modal").modal("show");
        },
        showUserModal(){
            this.newUser = {
                id:0,
                first_name:'',
                middle_name:'',
                last_name:'',
                email:'',
                telephone:'',
                mobile:'',
                password:'',
                fax:'',
                birth_date:'2000-01-01',
                birth_place:'',
                gender:'male',
                civil_status:'single',
                address:'',
                level:1,
            };
            $("#user-modal").modal("show");
        },
        mountImage(data){
            this.logo = data;
        },
        mountIcon(data){
            this.icon = data;
        },
        saveIcon(){
            let u = this;
            this.$http.put('../../api/icon', {icon:this.icon})
            .then((response) => {
                toastr.success(response.data.message, "Successfully saved");
                $("#icon-modal").modal("hide");
            }).catch(function (error) {
                if(error.response.data !== undefined)
                    if(error.response.data.message !== undefined)
                        toastr.error(error.response.data.message, "Saving Failed");
            });
        },
        saveLogo(){
            let u = this;
            this.$http.put('../../api/logo', {icon:this.icon})
            .then((response) => {
                toastr.success(response.data.message, "Successfully saved");
                $("#logo-modal").modal("hide");
            }).catch(function (error) {
                if(error.response.data !== undefined)
                    if(error.response.data.message !== undefined)
                        toastr.error(error.response.data.message, "Saving Failed");
            });
        },
        showLogoModal(){
            $("#logo-modal").modal("show");
        },
        showIconModal(){
            $("#icon-modal").modal("show");
        },
        changeSMSSetting(){
            let u = this;
             this.$http.put('../../api/sms/enabled', {value:this.sms_enabled})
                .then((response) => {
                    toastr.success(response.data.message, "Successfully saved");
                    u.getSettings();
                }).catch(function (error) {
                    if(error.response.data !== undefined)
                        if(error.response.data.message !== undefined)
                            toastr.error(error.response.data.message, "Saving Failed");
                });
        },
        addItem(){
            this.setting.config_value.push("");
        },
        removeItem(key){
            this.setting.config_value.splice(key, 1);
        },
        saveSetting(){
            if(this.user.level === 0)
                return false;

            let u = this;
            this.$http.put('../../api/config', this.setting)
                .then((response) => {
                    $("#setting-modal").modal("hide");
                    toastr.success(response.data.message, "Successfully saved");
                    u.getSettings();
                }).catch(function (error) {
                    if(error.response.data !== undefined)
                        if(error.response.data.message !== undefined)
                            toastr.error(error.response.data.message, "Saving Failed");
                })
                .then(function () {
                    u.stopButton(e.target)
                });
        },
        viewSettings(setting){
            if(!this.gate(this.user,'settings', 'update'))
                return false;
            this.setting = {
                id:setting.row.id,
                config_name:setting.row.config_name,
                config_value:setting.row.config_value,
                config_description:setting.row.config_description,
                config_type:setting.row.config_type,
                config_category:setting.row.config_category
            };

            $("#setting-modal").modal("show");
        },
        getSettings(){
            let u = this;
            this.$http.get('../../api/configs')
            .then(function (response) { 
                u.$store.commit('setConfigs', response.data);
                var e = [];
                response.data.forEach(element => {
                    if(element.config_category === 'payment' || element.config_category === 'application' || element.config_category === 'membership'){
                        if(element.config_type === 'boolean')
                            element.config_value = element.config_value==="true";
                        if(element.config_type === 'array')
                            element.config_value = JSON.parse(element.config_value);

                        e.push(element);
                    }
                    else{
                        if(element.config_name === 'SMS_ENABLED')
                            u.sms_enabled = element.config_value === 'true';
                    }
                });
                u.settings = e;
            });
        },
        getCredits(){
            let u = this;
            this.$http.get('../../api/sms/credits')
            .then(function (response) { 
               u.sms_credits = response.data;
               toastr.info("Remaining SMS Credits: " + response.data, "Credit Info");
            });
        },
        getUsers(){
            let u = this;
            this.$http.get('../../api/users')
            .then(function (response) { 
               u.users = response.data;
            });
        },
        getUserLevels(e){
            let u = this;
            this.$http.get('../../api/levels')
            .then(function (response) { 
                u.levels = response.data;
                u.$store.commit('setLevels', response.data);
            });
        },
        viewUser(user){
            if(!this.gate(this.user,'users', 'update'))
                return false;
            user = user.row;
            this.newUser = {
                id:user.id,
                first_name:user.first_name,
                middle_name:user.middle_name,
                last_name:user.last_name,
                email:user.email,
                level:user.level,
                telephone:user.telephone,
                mobile:user.mobile,
                fax:user.fax,
                password:'',
                birth_date:moment(user.birth_date).format("YYYY-MM-DD"),
                birth_place:user.birth_date,
                gender:user.gender,
                civil_status:user.civil_status,
                address:user.address,
                level:user.level
            };
            $("#user-modal").modal("show");
        },
        viewLevel(level){
            if(!this.gate(this.user,'users', 'update'))
                return false;

            level = level.row;
            this.level = {
                id:level.id,
                level_name:level.level_name,
                description:level.description,
                level_data:{}
            };
            let u = this;
            this.permissions.forEach((item)=>{
                u.level.level_data[item.name] = function(){
                    if(level.level_data !== undefined){
                        if(level.level_data[item.name] !== undefined){
                            return level.level_data[item.name];
                        }
                    }
                    return [];
                }();
            });

            $("#level-modal").modal("show");
        },
        saveUser(e){
            if(this.user.level === 0)
                return false;

            let u = this;
            this.$http[this.newUser.id === 0?'post':'put']('../../api/user', this.newUser)
                .then((response) => {
                    $("#user-modal").modal("hide");
                    toastr.success(response.data.message, "Successfully saved");
                    u.getUsers();
                }).catch(function (error) {
                    if(error.response.data !== undefined)
                        if(error.response.data.message !== undefined)
                            toastr.error(error.response.data.message, "Saving Failed");
                })
                .then(function () {
                    u.stopButton(e.target)
                });
        },
        addUserLevel(e){
            if(this.user.level === 0)
                return false;

            let u = this;
            this.$http.post('../../api/level', this.level)
                .then((response) => {
                    $("#level-modal").modal("hide");
                    toastr.success(response.data.message, "Successfully saved");
                    u.getUserLevels();
                }).catch(function (error) {
                    if(error.response.data !== undefined)
                        if(error.response.data.message !== undefined)
                            toastr.error(error.response.data.message, "Saving Failed");
                })
                .then(function () {
                    u.stopButton(e.target)
                });
        },
        updateUserLevel(e){
            if(this.user.level === 0)
                return false;

            let u = this;
            this.$http.put('../../api/level', this.level)
                .then((response) => {
                    $("#level-modal").modal("hide");
                    toastr.success(response.data.message, "Successfully saved");
                    u.getUserLevels();
                }).catch(function (error) {
                    if(error.response.data !== undefined)
                        if(error.response.data.message !== undefined)
                            toastr.error(error.response.data.message, "Saving Failed");
                })
                .then(function () {
                    u.stopButton(e.target)
                });
        },
        getPermissions(){
            let u = this;
            this.$http.get('/api/permissions')
                .then(function (response) {
                    u.permissions = response.data;
                });
        }
    },
    mounted(){
        this.getSettings();
        this.getUsers();
        this.getUserLevels();
        this.getCredits();
        this.getPermissions();
    },
    watch:{
        sms_enabled(){
            this.sms_settings_fresh = false
        }
    },
    computed:{
        user(){
            return this.$store.state.user;
        },
        levels(){
            return this.$store.state.levels;
        }
    }
}
</script>