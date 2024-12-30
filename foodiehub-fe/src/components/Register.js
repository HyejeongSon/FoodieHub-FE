import React from "react";
import '../styles/Register.css';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bizFile: null, // 업로드된 파일 상태
      uploadStatus: "", // 업로드 상태 메시지
    };
  }

  handleFileChange = (e) => {
    const file = e.target.files[0];
    this.setState({ bizFile: file });
  };

  handleFileUpload = (e) => {
    e.preventDefault();
    const { bizFile } = this.state;

    if (!bizFile) {
      this.setState({ uploadStatus: "파일을 선택해주세요." });
      return;
    }

    // 파일 업로드 처리
    const formData = new FormData();
    formData.append("biz_file", bizFile);

    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          this.setState({ uploadStatus: "파일 업로드 성공!" });
        } else {
          this.setState({ uploadStatus: "파일 업로드 실패." });
        }
      })
      .catch((error) => {
        console.error("업로드 중 오류 발생:", error);
        this.setState({ uploadStatus: "파일 업로드 중 오류가 발생했습니다." });
      });
  };
    render() {
      const { uploadStatus } = this.state;
        
      return (
        <div>
          <form>
            <div>
            <h1 id='register_title'>사장님 회원가입</h1>
            </div>
            <div className='register'>
            <div>
                {/* 아이디 */}
                <div>
                <h5> 아이디 </h5>
                <input type='text' class="input-field" maxLength='20' name='register_id' placeholder="7자 이상의 문자" autoFocus/>
                <button type="button" id="dupIdCheck">중복확인</button>
                </div>

                {/* 비밀번호 */}
                <div>
                <h5> 비밀번호 </h5>
                <input type='password' class="input-field" maxLength='15' name='register_password' placeholder="비밀번호"/>
                </div>

                {/* 비밀번호 */}
                <div>
                <h5> 비밀번호 확인 </h5>
                <input type='password' class="input-field" maxLength='15' name='register_pswCheck' placeholder="비밀번호 확인"/>
                </div>
            
                {/* 가게전화번호 */}
                <div>
                <h5> 연락처 </h5>
                <input type='tel' class="input-field" maxLength='11' name='register_tel' placeholder="전화번호"/>
                </div>

                {/* 사업자 등록번호 */}
                <div>
                <h5> 사업자 등록번호 </h5>
                <input type='text' class="input-field2" maxLength='10' name='biz_number'/> 
                </div>

                {/* 사업자 등록증 파일업로드 */}
                <div>
                <h5> 사업자등록증 파일 </h5>
                <input type='file' class="input-field2" maxLength='15' name='biz_file'onChange={this.handleFileChange}/>  
                <button onClick={this.handleFileUpload}>파일 업로드</button>
                {uploadStatus && <p>{uploadStatus}</p>}
                </div>
              </div>
            </div>
            <div>
            <button type="submit" id="presbtn">이전으로</button>  
            </div>
            <div>
            <button type="submit" id="sbtn">가입하기&nbsp;🎉</button>
            </div>
        </form>
      </div>

        )
    }
}

export default Register;