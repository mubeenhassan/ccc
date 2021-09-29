import React from 'react'
import axios from 'axios'
import './App.css'
import Accordion from 'react-bootstrap/Accordion'
import logo from './logo.png'
import Adds from './components/Adds'
import html2PDF from 'jspdf-html2canvas'

import Add_1 from './images/Add_1.png';
import Add_2 from './images/Add_2.png';
import Add_3 from './images/Add_3.png';
import Add_4 from './images/Add_4.png';
import Add_5 from './images/Add_5.png';
import Add_6 from './images/Add_6.png';
import Add_7 from './images/Add_7.jpeg';
import Add_8 from './images/Add_8.png';
import Add_9 from './images/Add_9.png';

const defaultOptions = {
  jsPDF: {
    unit: 'px',
    format: 'a4',
  },
  html2canvas: {
    imageTimeout: 15000,
    logging: true,
    useCORS: true,
  },
  imageType: 'image/jpeg',
  imageQuality: 1,
  margin: {
    top: 10,
    right: 0,
    bottom: 10,
    left: 0,
  },
  output: 'Columbia-Community-Connection-Posts.pdf', 
  init: function() {},
  success: function(pdf) {
    pdf.save(this.output);
  },
  watermark({ pdf, pageNumber, totalPageNumber }) {
    pdf.setTextColor('gray');
    pdf.text(375,  20, `Page : ${pageNumber}/${totalPageNumber}`);
  },
}

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      posts: [],
      isloading: false,
      isDownloading: false,
      selectedPosts: 0,
      adsToShow:[],
    }
  }

  componentDidMount() {
    this.setState({ isloading: true })
    axios.get(`http://localhost:3001/api`).then((res) => {
      this.puringfyingHtml(res.data)
    })
    this.watherFun(document, 'script', 'weatherwidget-io-js')
    let random =[Math.floor(Math.random() * 9) + 1, Math.floor(Math.random() * 9) + 1]
    this.setState({
      adsToShow:random
    })
       
    // document.getElementById('add-1').appendChild(this.injectImages(random[0]));
    // document.getElementById('add-2').appendChild(this.injectImages(random[1]));

  }
  returnToday=()=>{
    var today = new Date()
    var dd = String(today.getDate()).padStart(2, '0')
    var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
    var yyyy = today.getFullYear();
    return today = mm + '/' + dd + '/' + yyyy
  }


  puringfyingHtml = (html) => {
    let pureHTML = []
    html.map((item, i) => {
      let str = item.html

      let pubDate = str.substring(
        str.lastIndexOf('<pubdate>') + 9,
        str.lastIndexOf('</pubdate>') - 5
      )

      let publisher = str.substring(
        str.lastIndexOf('<dc:creator>') + 12,
        str.lastIndexOf('</dc:creator>')
      )

      let partToRemove = str.substring(
        str.lastIndexOf(']]&gt'),
        str.lastIndexOf('</media:title>')
      )
      let res = str.replace(partToRemove, '')

      partToRemove = res.substring(
        res.lastIndexOf('</title>') + 8,
        res.lastIndexOf('</guid>')
      )

      res = res.replace(partToRemove, '')

      pureHTML.push({
        postID: 'post_' + i,
        title: item.title,
        html: res,
        publishDate: pubDate,
        publisher: publisher,
        isChecked: false,
      })
      this.setState({ posts: pureHTML, isloading: false })
    })
    return pureHTML
  }

  watherFun = (d, s, id) => {
    var js,
      fjs = d.getElementsByTagName(s)[0]
    if (!d.getElementById(id)) {
      js = d.createElement(s)
      js.id = id
      js.src = 'https://weatherwidget.io/js/widget.min.js'
      fjs.parentNode.insertBefore(js, fjs)
    }
  }

  handleSelectPost = (post) => {
    if (!post.isChecked && this.state.selectedPosts >= 5) {
      alert('You can select 5 posts to download only!')
    } else {
      let element = this.state.posts
      let newPosts = []
      for (let i = 0; i < this.state.posts.length; i++) {
        let p = element[i]
        if (post.postID === element[i].postID) {
          if (post.isChecked) {
            p.isChecked = false
            this.setState({ selectedPosts: this.state.selectedPosts - 1 })
          } else {
            this.setState({ selectedPosts: this.state.selectedPosts + 1 })
            p.isChecked = true
          }
        }
        newPosts.push(p)
      }
      this.setState({
        posts: newPosts,
      })
    }
  }


  injectImages=(val)=>{

    var img = document.createElement('img'); 
    img.className="add-img"
    switch (val) {
      case 1:
        img.src=Add_1;
        return img      
      case 2:
        img.src=Add_2;
        return img      
      case 3:
        img.src=Add_3;
        return img      
      case 4:
        img.src=Add_4;
        return img      
      case 4:
        img.src=Add_4;
        return img      
      case 5:
        img.src=Add_5;
        return img      
      case 6:
        img.src=Add_6;
        return img      
      case 7:
        img.src=Add_7;
        return img      
      case 8:
        img.src=Add_8;
        return img      
      case 9:
        img.src=Add_9;
        return img      
    
      default:
        break;
    }
  }

  handleDownload = async () => {

    if(this.state.selectedPosts <=0){
      alert("Please select any post to download.");
      return;
    }    
    document.getElementById('add-1').appendChild(this.injectImages(this.state.adsToShow[0]));
    document.getElementById('add-2').appendChild(this.injectImages(this.state.adsToShow[1]));

    this.injectImages(this.state.adsToShow[1]);
    let main = document.getElementById('main');
    let downloadBtn= document.getElementById('downloadBtn');
    let myPDf= document.getElementById('pdf-container');
    let dis =document.getElementById('display-container');
    document.getElementById("hide").style.display="none"
    myPDf.style.display="block";
    dis.style.display="none";
    downloadBtn.style.display="none";
    main.style.border="none"
    this.setState({ isDownloading: true })

    const pdf = await html2PDF(main, defaultOptions)
   



    // var api_endpoint = "https://selectpdf.com/api2/convert/";
    // var api_key = "d212ca46-423f-4270-817a-4444204eaa2a";
 
    // var url = 'https://www.columbiacommunityconnection.com/the-dalles/this-week-in-gorge-entertainment-sept-27/jim-drake'; // current page
 
    // var params = {
    //     key: api_key, 
    //     html: document.documentElement.innerHTML,
    //     page_size:'a4'
    // }
 
    // var xhr = new XMLHttpRequest();
    // xhr.open('POST', api_endpoint, true);
    // xhr.setRequestHeader("Content-Type", "application/json");
 
    // xhr.responseType = 'arraybuffer';
 
    // xhr.onload = function (e) {
    //     if (this.status == 200) {
    //       console.log(this.response)
    //         //console.log('Conversion to PDF completed ok.');
 
    //         var blob = new Blob([this.response], { type: 'application/pdf' });
    //         var url = window.URL || window.webkitURL;
    //         var fileURL = url.createObjectURL(blob);
    //         //window.location.href = fileURL;
 
    //         //console.log('File url: ' + fileURL);
 
    //         var fileName = "Document.pdf";
 
    //         if (navigator.appVersion.toString().indexOf('.NET') > 0) {
    //             // This is for IE browsers, as the alternative does not work
    //             window.navigator.msSaveBlob(blob, fileName);
    //         }
    //         else {
    //             // This is for Chrome, Firefox, etc.
    //             var a = document.createElement("a");
    //             document.body.appendChild(a);
    //             a.style = "display: none";
    //             a.href = fileURL;
    //             a.download = fileName;
    //             a.click();
    //         }
    //     }
    //     else {
    //         //console.log("An error occurred during conversion to PDF: " + this.status);
    //         alert("An error occurred during conversion to PDF.\nStatus code: " + this.status + ", Error: " + String.fromCharCode.apply(null, new Uint8Array(this.response)));
    //     }
    // };
 
    // xhr.send(JSON.stringify(params));




    myPDf.style.display="none";
    dis.style.display="block";
    downloadBtn.style.display="block";
    main.style.border="2px solid darkgray"
    this.setState({ isDownloading: false })
  }

  render() {
    const Loader = () => (
      <div className='loader-container'>
        <svg
          class='loader'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 340 340'
        >
          <circle cx='170' cy='170' r='160' stroke='#E2007C' />
          <circle cx='170' cy='170' r='135' stroke='#404041' />
          <circle cx='170' cy='170' r='110' stroke='#E2007C' />
          <circle cx='170' cy='170' r='85' stroke='#404041' />
        </svg>
      </div>
    )

    return (
      <div className='App'>
        {this.state.isDownloading ? (
          <Loader />
        ) : (
          <div id='main'>
            <div className='header'>
              <div id='page_number'>0</div>
              <div className='logo-img'>
                <img src={logo} alt='' crossOrigin="anonymous"/>
                <h5 className='logo-title'>
                  honest local news for the mid columbia region
                </h5>
              </div>
              <div className='download-btn-container'>
                <h2 id='today-date'>{this.returnToday()}</h2>
                <button id="downloadBtn" onClick={this.handleDownload}>Download Posts</button>
              </div>
            </div>
            <div className='hr'></div>

            <div className='main-container'>
              <div className='posts'>
                <div id='pdf-container'>
                  {this.state.posts.map((post, i) => {
                    return (
                      post.isChecked && (
                        <div>
                          <div
                            dangerouslySetInnerHTML={{ __html: post.html }}
                          />
                          <div className='pub-data'>
                            {post.publishDate} <br />
                            {post.publisher}
                          </div>
                        </div>
                      )
                    )
                  })}
                </div>

                <div id='display-container'>
                  {this.state.isloading ? (
                    <Loader />
                  ) : (
                    <Accordion>
                      {this.state.posts.map((post, i) => {
                        return (
                          <Accordion.Item eventKey={i} key={i}>
                            <Accordion.Header>
                              <div className='checkbox-container'>
                                <input
                                  type='checkbox'
                                  id={'checkbox_' + i}
                                  checked={post.isChecked}
                                  onChange={() => {
                                    this.handleSelectPost(post)
                                  }}
                                />
                                <label htmlFor={'checkbox_' + i}></label>
                              </div>
                              {post.title}
                            </Accordion.Header>
                            <Accordion.Body>
                              <div
                                dangerouslySetInnerHTML={{ __html: post.html }}
                              />
                              <div className='pub-data'>
                                {post.publishDate} <br />
                                {post.publisher}
                              </div>
                            </Accordion.Body>
                          </Accordion.Item>
                        )
                      })}
                    </Accordion>
                  )}
                </div>
              </div>

              <div className='ads-data'>
                <div id='add-1' className='ads'>
                  {!this.state.isDownloading &&<Adds random={this.state.adsToShow[0]} />}
                </div>
                <div id="hide" className='wather'>
                  <a
                    className='weatherwidget-io'
                    href='https://forecast7.com/en/45d59n121d18/the-dalles/?unit=us'
                    data-label_1='THE DALLES'
                    data-label_2='WEATHER'
                    data-theme='original'
                    data-basecolor='#3489b0'
                    data-cloudfill='#3489b0'
                    //   style='
                    //   display: block;
                    //   position: relative;
                    //   height: 211px;
                    //   padding: 0px;
                    //   overflow: hidden;
                    //   text-align: left;
                    //   text-indent: -299rem;
                    // '
                  >
                    THE DALLES WEATHER
                    <iframe
                      id='weatherwidget-io-0'
                      className='weatherwidget-io-frame'
                      title='Weather Widget'
                      scrolling='no'
                      frameBorder='0'
                      width='100%'
                      src='https://weatherwidget.io/w/'
                      //   style='
                      //   display: block;
                      //   position: absolute;
                      //   top: 0px;
                      //   height: 211px;
                      // '
                    ></iframe>
                  </a>
                </div>
                <div className='provided-text'>
                  Columbia Community Connection was established in 2020 as a
                  local, honest and digital news source providing meaningful
                  stories and articles. CCCNews’ primary goal is to inform and
                  elevate all the residents and businesses of the Mid-Columbia
                  Region.
                </div>
                <div id='add-2' className='ads'>
                  <Adds random={this.state.adsToShow[1]}/>
                  {/* <Adds random={2} />
                  <Adds random={3} />
                  <Adds random={4} />
                  <Adds random={5} />
                  <Adds random={6} />
                  <Adds random={7} />
                  <Adds random={8} />
                  <Adds random={9} /> */}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}
