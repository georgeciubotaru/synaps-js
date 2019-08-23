'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SynapsClient = function () {
	function SynapsClient(client_id) {
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
			type: 'modal',
			mode: 'production'
		};

		_classCallCheck(this, SynapsClient);

		this.base_url = 'https://workflow.synaps.io';
		this.client_id = client_id;
		this.isWorkflowOpen = false;
		this.workflowType = options.type;
		this.iframe = document.createElement('iframe');
		this.email = '';
		this.userOnboardSuccessCallback = null;
		this.userExitedCallback = null;
		this.userOnboardDeclinedCallback = null;
		this.initStyle();

		if (options.mode === 'sandbox') {
			this.base_url = 'https://workflow.synaps.io/sandbox.html';
		}

		if (options.type === 'modal' || options.type === 'embed') {
			this.workflowType = options.type;
		}
	}

	_createClass(SynapsClient, [{
		key: 'initModal',
		value: function initModal() {
			var _this = this;
			document.addEventListener('click', function (event) {
				var element = event.target;
				if ((element.tagName === 'BUTTON' || element.tagName === 'A') && element.attributes.id) {
					if (element.attributes.id.value === 'synaps-kyc' && _this.isWorkflowOpen === false) {
						_this.openWorkflow();
					}
				}
			});
		}
	}, {
		key: 'initEmbedded',
		value: function initEmbedded(id) {
			var embeddedWorkflow = this.getWorkflow();
			var embedElement = document.getElementById(id);
			if (embedElement !== null) {
				this.isWorkflowOpen = true;
				embeddedWorkflow.setAttribute('class', 'synaps-embedded-workflow-container');
				embedElement.appendChild(embeddedWorkflow);
			}
		}
	}, {
		key: 'on',
		value: function on(type, callback) {
			if (type === 'userExited') {
				this.userExitedCallback = callback;
			}
			if (type === 'userOnboardSuccess') {
				this.userOnboardSuccessCallback = callback;
			}
			if (type === 'userOnboardDeclined') {
				this.userOnboardDeclinedCallback = callback;
			}
		}
	}, {
		key: 'init',
		value: function init() {
			var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
				email: '',
				id: 'synaps-kyc-embed'
			};

			this.setupEvents();
			this.email = options.email;
			if (this.workflowType === 'embed' && options.id !== '') {
				this.initEmbedded(options.id);
			}

			if (this.workflowType === 'modal') {
				this.initModal();
			}
		}
	}, {
		key: 'initStyle',
		value: function initStyle() {
			var styleSheet = document.createElement('style');
			styleSheet.type = 'text/css';
			styleSheet.innerText = styles;
			document.head.appendChild(styleSheet);
		}
	}, {
		key: 'setupEvents',
		value: function setupEvents() {
			var _this = this;
			window.addEventListener('message', function (e) {
				if (e.data.type && e.data.type === 'user_exited') {
					if (_this.workflowType === 'modal') {
						_this.closeWorkflow();
					}
					if (typeof _this.userExitedCallback === 'function') {
						_this.userExitedCallback();
					}
				}
				if (e.data.type && e.data.type === 'user_onboard_success') {
					if (typeof _this.userOnboardSuccessCallback === 'function') {
						_this.userOnboardSuccessCallback(e.data.data.authorization_code);
					}
				}
				if (e.data.type && e.data.type === 'user_onboard_declined') {
					if (typeof _this.userOnboardDeclinedCallback === 'function') {
						_this.userOnboardDeclinedCallback();
					}
				}
			});
		}
	}, {
		key: 'openWorkflow',
		value: function openWorkflow() {
			if (this.isWorkflowOpen === true) {
				return;
			}
			this.isWorkflowOpen = true;
			var html = document.getElementsByTagName('html')[0];
			var body = document.getElementsByTagName('body')[0];
			html.style.overflow = 'hidden';
			html.style.overflow = 'hidden';
			body.style.margin = '0';
			body.style.margin = '0';
			var src = this.base_url + '?client_id=' + this.client_id;
			if (this.email !== null) {
				src = src + '&email=' + this.email;
			}
			src = src + '&type=' + this.workflowType;
			this.iframe.setAttribute('src', src);
			this.iframe.setAttribute('allow', 'microphone; camera; midi; encrypted-media;');
			this.iframe.setAttribute('id', 'synaps-embed');
			this.iframe.setAttribute('allowtransparency', 'true');
			this.iframe.setAttribute('frameborder', 'none');
			this.iframe.setAttribute('border', '0');
			this.iframe.setAttribute('resize', 'none');
			this.iframe.setAttribute('style', 'z-index: 99999999; overflow: hidden auto; visibility: visible; margin: 0px; padding: 0px; position: fixed; border-color: transparent; border-width: 0; border-style: none; left: 0px; top: 0px; width: 100%; height: 100%; -webkit-tap-highlight-color: transparent;');
			this.isWorkflowOpen = true;
			document.body.appendChild(this.iframe);
		}
	}, {
		key: 'getWorkflow',
		value: function getWorkflow() {
			var src = this.base_url + '?client_id=' + this.client_id;
			if (this.email !== '') {
				src = src + '&email=' + this.email;
			}
			src = src + '&type=' + this.workflowType;
			this.iframe.setAttribute('src', src);
			this.iframe.setAttribute('allow', 'microphone; camera; midi; encrypted-media;');
			this.iframe.setAttribute('id', 'synaps-embed');
			this.iframe.setAttribute('allowtransparency', 'true');
			this.iframe.setAttribute('frameborder', 'none');
			this.iframe.setAttribute('border', '0');
			this.iframe.setAttribute('resize', 'none');
			return this.iframe;
		}
	}, {
		key: 'closeWorkflow',
		value: function closeWorkflow() {
			var html = document.getElementsByTagName('html')[0];
			var body = document.getElementsByTagName('body')[0];
			html.style.removeProperty('overflow');
			body.style.removeProperty('overflow');
			html.style.removeProperty('margin');
			body.style.removeProperty('margin');
			var src = '#';
			this.iframe.setAttribute('src', src);
			this.iframe.setAttribute('style', 'display:none');
			this.isWorkflowOpen = false;
			document.body.appendChild(this.iframe);
		}
	}]);

	return SynapsClient;
}();

exports.default = SynapsClient;


var styles = '@import url(https://fonts.googleapis.com/css?family=Rubik&display=swap);.synaps-verify-btn-blue{outline:0;cursor:pointer;background:#2b415f;padding:13px;color:#fff;font-size:1.05rem;font-family:Rubik,sans-serif;border-radius:4px;border:1px solid #2b415f;padding-left:40px;background-image:url(https://s3-eu-west-1.amazonaws.com/synaps-cdn/synaps-logo-white.svg);background-size:16px;background-repeat:no-repeat;background-position:12px center}.synaps-verify-btn-blue:focus,.synaps-verify-btn-blue:hover{color:#fff;outline:0;background-color:#1d3349;border:1px solid #1d3349;-webkit-transform:translateY(-1px);transform:translateY(-1px)}.synaps-verify-btn-blue:active{color:#e6ebf1;background-color:#1d3349;-webkit-transform:translateY(1px);transform:translateY(1px);outline:0}.synaps-verify-btn-white{outline:0;cursor:pointer;background:#fff;padding:13px;color:#2b415f;font-size:1.05rem;font-family:Rubik,sans-serif;border-radius:4px;border:1px solid #f2f2f2;padding-left:40px;background-image:url(https://s3-eu-west-1.amazonaws.com/synaps-cdn/synaps-logo-blue.svg);background-size:16px;background-repeat:no-repeat;background-position:12px center}.synaps-verify-btn-white:focus,.synaps-verify-btn-white:hover{color:#365069;outline:0;background-color:#f9f9f9;border:1px solid #ddd;-webkit-transform:translateY(-1px);transform:translateY(-1px)}.synaps-verify-btn-white:active{color:#365069;background-color:#fff;-webkit-transform:translateY(1px);transform:translateY(1px);outline:0}.synaps-embedded-workflow-container{width:700px;height:700px;border-color:transparent;border-width:0;border-style:none;left:0;top:0;-webkit-tap-highlight-color:transparent}@media(max-width:700px){.synaps-embedded-workflow-container{width:98%}}';