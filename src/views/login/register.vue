<template>
  <div class="register">
    <el-dialog :visible.sync="dialogVisible" width="600px">
      <div slot="title" class="title">注册</div>
      <el-form label-width="100px" :model="resgisterForm" ref="registerFormRef">
        <el-form-item label="头像" prop="avatar" >
          <el-upload
            class="avatar-uploader"
            :action="uploadAction"
            name="image"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="昵称 " prop="username">
          <el-input v-model="resgisterForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="resgisterForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="resgisterForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input show-password v-model="resgisterForm.password"></el-input>
        </el-form-item>
        <el-form-item label="图形码" prop="code">
          <el-row>
            <el-col :span="15">
              <el-input v-model="resgisterForm.code"></el-input>
            </el-col>
            <el-col :span="8">
              <img class="captcha" :src="codeURL" @click="changeCodeURL" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="验证码" prop="rcode">
          <el-row>
            <el-col :span="17">
              <el-input v-model="resgisterForm.rcode"></el-input>
            </el-col>
            <el-col :span="4" style="margin-left:10px">
              <el-button @click="getRcode">获取用户验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "register",

  data() {
    return {
      codeURL: process.env.VUE_APP_BASEURL + "/captcha?type=sendsms",
      dialogVisible: false,
      imageUrl: "",
      uploadAction: process.env.VUE_APP_BASEURL + "/uploads",
      resgisterForm: {
        username: "",
        phone: "",
        email: "",
        avatar: "",
        password: "",
        code: "",
        rcode: ""
      },
      rules: {
        avatar: [{ required: true, message: "头像不能为空", trigger: "blur" }],
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        email: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("邮箱不能为空"));
                return;
              }
              const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
              if (!reg.text(value)) {
                return callback(new Error("邮箱不合法"));
              }
              callback();
            },
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("手机号不能为空"));
                return;
              }
              const reg = /^1[3456789][0-9]{9}$/;
              if (!reg.text(value)) {
                return callback(new Error("手机号不合法"));
              }
              callback();
            },
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, message: "密码长度最小是6位", trigger: "blur" }
        ],
        code: [
          { required: true, message: "图形码不能为空", trigger: "blur" },
          { min: 4, max: 4, message: "图形码必须是4位", trigger: "blur" }
        ],
        rcode: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("验证码不能为空"));
              }

              if (!Number.inInteger(value)) {
                return callback(new Error("验证码必须是数字"));
              }
            },
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    changeCodeURL() {
      this.codeURL =
        process.env.VUE_APP_BASEURL +
        "/captcha?type=sendsma&r=" +
        Math.random();
    },
    async getRcode() {
      const res = await this.$axios.post("/sendsms", {
        code: this.resgisterForm.code,
        phone: this.resgisterForm.phone
      });
      if (res.data.code === 200) {
        this.resgisterForm.rcode = res.data.data.captcha;
      } else {
        this.$message.error(res.data.message);
        this.changeCodeURL();
      }
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = process.env.VUE_APP_BASEURL + '/' + res.data.file_path

      // 给registerForm中的avatar模型赋值
      this.resgisterForm.avatar = res.data.file_path
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    submit() {
      // 做最后一次校验
      this.$refs.registerFormRef.validate(async valid => {
        if (!valid) return

        const res = await this.$axios.post('/register', this.resgisterForm)

        if (res.data.code === 200) {
          // 提示
          this.$message({
            message: '注册成功~',
            type: 'success'
          });

          // 关闭掉当前窗口
          this.dialogVisible = false
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  }
};
</script>

<style lang='less'>
.register {
  .title {
    height: 53px;
    background: #03c0f9;
    color: #fff;
    text-align: center;
    line-height: 53px;
  }
  .el-dialog__header {
    padding: 0px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
  .captcha {
    width: 100%;
    height: 40px;
  }
  .avatar-uploader {
    text-align: center;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>