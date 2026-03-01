
import './App.css';
import { useEffect, useState, useRef } from 'react';
import axios from "axios";

function App() {

  const API = "http://127.0.0.1:3001";
  const [citySubmitData, setCitySubmitData] = useState(null);
  const [userSubmitData, setUserSubmitData] = useState({
    name: "",
    city: "",
    salary: "",
    mobile: "",
    profile: "",
  })

  const fileRef = useRef(null);
  const [userList, setUserList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const handleDeleteData = async (data) => {
    const userId = data?.id;
    await axios.delete(`${API}/users/${userId}`)
    fetchUserListData();
  }

  const handleSubmit = async () => {
    console.log(userSubmitData);
    if (editModal) {
      const userId = userSubmitData?.id;
      await axios.put(`${API}/users/${userId}`, userSubmitData)
    } else {
      await axios.post(`${API}/users`, userSubmitData);

    }

    if (fileRef.current){
      fileRef.current.value = "";
    }
    setUserSubmitData({
      name: "",
      city: "",
      salary: "",
      mobile: "",
      profile: "",
    });
    fetchUserListData();
  }

  const handleCitySubmit = async () => {
    if (!citySubmitData || !citySubmitData.city_name) return;

    const exists = cityList.some(
      (c) => c.city_name.toLowerCase() === citySubmitData.city_name.toLowerCase()
    );
    if (exists) {
      alert("This city has already been added.");
      return;
    }

    await axios.post(`${API}/city`, citySubmitData);
    setCitySubmitData(null);
    fetchCityListData();
  }

  const fetchUserListData = async () => {
    const respData = await axios.get(`${API}/users`);
    console.log(respData.data)
    setUserList(respData.data)
  }
  // const fetchCityListData = async () => {
  //   const respData = await axios.get(`${API}/city`);
  //   console.log(respData.data)
  //   setCityList(respData.data)
  // }

  const fetchCityListData = async () => {
  try {
    console.log("Calling city API...");
    const respData = await axios.get(`${API}/city`);
    console.log("SUCCESS:", respData.data);
    setCityList(respData.data);
  } catch (error) {
    console.log("REAL ERROR:", error.message);
  }
};

  useEffect(() => {
    fetchCityListData();
    fetchUserListData();
  }, [])


  return (
    <div className="App">
      <div className='prictical-card1'>
        <div>
          step:1
        </div>
        <div>
          <label for="cityName">City Name:</label>
          <input className='form-control' type="text" id="cityName" name="cityName"
            value={citySubmitData !== null ? citySubmitData?.city_name : ''}
            onChange={(e) => {
              const valueData = e.target.value;
              setCitySubmitData({ city_name: valueData })
            }}
          />
        </div>
        <div className='mt-2'>
          <button type="button" className="btn btn-primary"
            onClick={handleCitySubmit}
          >Submit</button>
        </div>
      </div>
      <div className='prictical-card1'>
        <div>
          step:2
        </div>
        <div>
          <label for="name">Name:</label>
          <input className='form-control' type="text" id="name" name="name"
            value={userSubmitData?.name}
            onChange={(e) => {
              const valueData = e.target.value;
              setUserSubmitData({ ...userSubmitData, name: valueData })
            }} />
        </div>
        <div>
          <label for="city">City:</label>
          <select className='form-control' id="city" name="city"
            value={userSubmitData?.city}
            onChange={(e) => {
              const valueData = e.target.value;
              setUserSubmitData({ ...userSubmitData, city: valueData })
            }}
          >
            <option value="">Select City</option>
            {cityList && cityList.length > 0 && cityList.map((data)=>{
              return(
                <option key={data?.id} value={data?.id}>{data?.city_name}</option>
              )
            })}
          </select>
        </div>
        <div>
          <label for="salary">Salary:</label>
          <input className='form-control' type="text" id="salary" name="salary"
            value={userSubmitData?.salary}
            onChange={(e) => {
              const valueData = e.target.value;
              setUserSubmitData({ ...userSubmitData, salary: valueData })
            }} />
        </div>
        <div>
          <label for="mobile">Mobile:</label>
          <input className='form-control' type="text" id="mobile" name="mobile"
            value={userSubmitData?.mobile}
            onChange={(e) => {
              const valueData = e.target.value;
              setUserSubmitData({ ...userSubmitData, mobile: valueData })
            }} />
        </div>
        <div>
          <label for="profilepicture">Profile Picture:</label>
          <input className='form-control' type="file" id="profile-picture" name="profile-picture"
            accept='image/png, image/jpg'
            ref = {fileRef}
            onChange={(e) => {
              const valueData = e.target.files[0];
              const reader = new FileReader();
              reader.onloadend=()=>{
                setUserSubmitData({ ...userSubmitData, profile: reader.result });
              }
              reader.readAsDataURL(valueData)
            }} />
        </div>
        <div className='mt-2'>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
          {editModal &&
            <button type="button" className="btn btn-primary ms-2" onClick={() => {
              setEditModal(false);
              setUserSubmitData({
                name: "",
                city: "",
                salary: "",
                mobile: "",
                profile: "",
              });
            }}>Cancel</button>
          }
        </div>
      </div>

      <div className='prictical-card1'>
        <div>
          step:3
        </div>
        <div>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Name</th>
                <th>City</th>
                <th>Salary</th>
                <th>Mobile</th>
                <th>Profile Picture</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {userList && userList.length > 0 ? <>
                {userList.map((data, index) => {
                  return (
                    <tr key={data?.id}>
                      <td>{index + 1}</td>
                      <td>{data?.name}</td>
                      <td>{data?.city}</td>
                      <td>{data?.salary}</td>
                      <td>{data?.mobile}</td>
                      <td><img src={data?.profile} className="profile-img" alt="profile" /></td>
                      <td><button type="button" className="btn btn-warning"
                        onClick={() => {
                          setUserSubmitData(data);
                          setEditModal(true);
                        }}
                      >Edit</button></td>
                      <td><button type="button" className="btn btn-danger" onClick={() => {
                        handleDeleteData(data);

                      }}>Delete</button></td>
                    </tr>
                  )
                })}
              </> : <>
                <tr>
                  <td colSpan={8}>Data Not found!</td>
                </tr>
              </>}

            </tbody>
          </table>
        </div>
      </div>

      
    </div>
  );
}

export default App;
