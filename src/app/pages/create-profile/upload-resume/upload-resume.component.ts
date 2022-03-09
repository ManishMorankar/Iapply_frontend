import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { toBase64String } from '@angular/compiler/src/output/source_map';

@Component({
  selector: 'app-upload-resume',
  templateUrl: './upload-resume.component.html',
  styleUrls: ['./upload-resume.component.scss']
})
export class UploadResumeComponent implements OnInit {
  CustomerProfileId: 0;
  currentUser;
  resumeAttachments: string[] = [];
  formData;
  submitted;
  personalProfile: any;
  iApplyUser;
  uploadDocumentForm: FormGroup;

  iconList = [ // array of icon class list based on type
    { type: "xlsx", icon: "fa fa-file-excel" },
    { type: "pdf", icon: "fa fa-file-pdf" },
    { type: "jpg", icon: "fa fa-file-image" },
    { type: "docx", icon: "fa fa-file-word-o" },
    { type: "png", icon: "fa fa-file-image" },
    { type: "csv", icon: "fa fa-file-csv" },
    { type: "txt", icon: "fa fa-file-text" },
    { type: "json", icon: "fa fa-file-text" },
  ];
  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService, private toastMsg: ToastrService, private _sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    if (localStorage.getItem("iApplyUser") != null) {
      this.iApplyUser = JSON.parse(localStorage.getItem("iApplyUser"));
      if (!this.apiService.checkPermission(this.iApplyUser.userType)) {
        this.router.navigate(['login']);
      }
    }
    else {
      this.router.navigate(['login']);
    }
    this.currentUser = JSON.parse(localStorage.getItem('iApplyUser'));

    this.uploadDocumentForm = this.formBuilder.group({
      UploadDocument: ['']
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.CustomerProfileId = params['CustomerProfileId'];
    });
    if (this.CustomerProfileId == 0 || this.CustomerProfileId == undefined) {
      this.getPersonalProfile();
    }
  }

  getPersonalProfile() {
    this.apiService.get('CustomerProfile/PersonalProfile/' + this.currentUser.customerId)
      .subscribe(data => {
        if (data.statusCode === '201' && data.result) {
          this.personalProfile = data.result;
          this.CustomerProfileId = this.personalProfile.customerProfileId;
        }
      })
  }

  selectFile(event) {
    if (this.resumeAttachments.length > 0) {
      this.resumeAttachments = [];
    }
    if (event.target.files.length === 0) {
      return;
    }
    for (var i = 0; i < event.target.files.length; i++) {
      this.resumeAttachments.push(event.target.files[i]);
    }
    console.log(this.resumeAttachments);
    console.log(this.uploadDocumentForm.value);
  }

  parseResume() {
    // get personal info

    // save resume in local storage
    localStorage.setItem('parsed-resume', JSON.stringify(this.resumeContext));
    localStorage.setItem('from-resume', "true");

    // var numbers = resumeContext["value"]["ResumeData"]["ContactInformation"]["Telephones"];
    // if (numbers.length > 0) {
    //   this.personalProfile.mobileNo = numbers[0];
    //   if (numbers.length > 1) {
    //     this.personalProfile.mobileNo = numbers[1];
    //   }
    // }
    // this.personalProfile.emailAddress = resumeContext["value"]["ResumeData"]["ContactInformation"]["EmailAddresses"];
    // this.personalProfile.country = resumeContext["value"]["ResumeData"]["ContactInformation"]["location"]["CountryCode"];
    // this.personalProfile.postalCode = resumeContext["value"]["ResumeData"]["ContactInformation"]["location"]["PostalCode"];
    // var mobileNo = resumeContext["value"]["ResumeData"]["ContactInformation"]["Telephones"]["raw"];
    // var mobileNo = resumeContext["value"]["ResumeData"]["ContactInformation"]["Telephones"]["raw"];
    // var mobileNo = resumeContext["value"]["ResumeData"]["ContactInformation"]["Telephones"]["raw"];
    // var mobileNo = resumeContext["value"]["ResumeData"]["ContactInformation"]["Telephones"]["raw"];


  }


  removeFile(document) {
    this.resumeAttachments.splice(document, 1);
    this.resumeAttachments = [];
  }
  getFileExtension(document) { // this will give you icon class name
    let ext = document.split(".").pop();
    let obj = this.iconList.filter(row => {
      if (row.type === ext) {
        return true;
      }
    });
    if (obj.length > 0) {
      let icon = obj[0].icon;
      return icon;
    } else {
      return "";
    }
  }
  onNext() {

    if (this.resumeAttachments.length > 0) {
      this.submitted = true;
      console.log(this.uploadDocumentForm.value);
      this.formData = new FormData();

      this.formData.append('CustomerProfileId', this.currentUser.customerId);
      this.formData.append('AddedBy', this.currentUser.customerId);
      this.formData.append('DocumentType', "Resume");
      for (let i = 0; i < this.resumeAttachments.length; i++) {
        this.formData.append('ResumeAttachment', this.resumeAttachments[i]);
      }
      this.apiService.post('CustomerProfile/CreateProfileWithResume', this.formData)
        .subscribe(data => {
          if (data.statusCode === "201" && data.result) {

            localStorage.setItem('parsed-resume', data.result.response);
            localStorage.setItem('from-resume', "true");
            //localStorage.setItem('ResumeProfile', JSON.stringify(data.result));
            localStorage.setItem('PersonalProfileStatus', "Pending");
            localStorage.setItem('ExperienceStatus', "Pending");
            localStorage.setItem('EducationStatus', "Pending");
            localStorage.setItem('OtherDetailsStatus', "Pending");
            localStorage.setItem('JobPreferenceStatus', "Pending");
            this.router.navigate(['customer/personal-profile']);
          }
        });
    }
  }



resumeContext: any = {

  "Info": {
    "Code": "Success",
    "Message": "Successful transaction",
    "TransactionId": "a07685a8-e431-4d90-8e22-92756251bae4",
    "EngineVersion": "9.6.8.0",
    "ApiVersion": "10.2.0.0",
    "TotalElapsedMilliseconds": 2140,
    "TransactionCost": 2.6,
    "CustomerDetails": {
      "AccountId": "********",
      "Name": "Sovren Web Demo",
      "IPAddress": "52.31.11.178",
      "Region": "eu-west-1",
      "CreditsRemaining": 199540768,
      "CreditsUsed": 459232,
      "ExpirationDate": "2027-11-03",
      "MaximumConcurrentRequests": 10
    }
  },
  "Value": {
    "ParsingResponse": {
      "Code": "WarningsFoundDuringParsing",
      "Message": "Successful transaction. This is not an error code. This is an advanced level message about the document, not about the parsing. For more information, refer to the ResumeQuality section in the parsed document output and to https://sovren.com/technical-specs/latest/rest-api/resume-parser/overview/parser-output."
    },
    "ResumeData": {
      "ContactInformation": {
        "Telephones": [
          {
            "Raw": "9657846601",
            "Normalized": "+91 9657846601",
            "InternationalCountryCode": "91",
            "SubscriberNumber": "9657846601"
          }
        ],
        "EmailAddresses": [
          "tmbodele1223@gmail.com"
        ],
        "Location": {
          "CountryCode": "IN",
          "PostalCode": "440022",
          "Regions": [
            "MH"
          ],
          "Municipality": "Nagpur"
        }
      },
      "Education": {
        "HighestDegree": {
          "Name": {
            "Raw": "MBA",
            "Normalized": "MBA"
          },
          "Type": "masters"
        },
        "EducationDetails": [
          {
            "Id": "DEG-1",
            "Text": "•   Symbiosis Institute of Telecom\n\nManagement, Pune MH. 2016\nMBA: Marketing",
            "SchoolName": {
              "Raw": "Symbiosis Institute of Telecom",
              "Normalized": "Symbiosis Institute of Telecom"
            },
            "SchoolType": "university",
            "Location": {
              "CountryCode": "IN",
              "Regions": [
                "MH"
              ],
              "Municipality": "Pune"
            },
            "Degree": {
              "Name": {
                "Raw": "MBA",
                "Normalized": "MBA"
              },
              "Type": "masters"
            },
            "Majors": [
              "Marketing"
            ],
            "LastEducationDate": {
              "Date": "2016-01-01",
              "IsCurrentDate": false,
              "FoundYear": true,
              "FoundMonth": false,
              "FoundDay": false
            }
          },
          {
            "Id": "DEG-2",
            "Text": "•   Yashwantrao  Chavan College of Engineering, Nagpur MH. 2009\n\nBE: Electrical Engg",
            "SchoolName": {
              "Raw": "Yashwantrao  Chavan College of Engineering",
              "Normalized": "Yashwantrao Chavan College of Engineering"
            },
            "SchoolType": "university",
            "Location": {
              "CountryCode": "IN",
              "Regions": [
                "MH"
              ],
              "Municipality": "Nagpur"
            },
            "Degree": {
              "Name": {
                "Raw": "BE",
                "Normalized": "bachelors"
              },
              "Type": "bachelors"
            },
            "Majors": [
              "Electrical Engg"
            ],
            "LastEducationDate": {
              "Date": "2009-01-01",
              "IsCurrentDate": false,
              "FoundYear": true,
              "FoundMonth": false,
              "FoundDay": false
            }
          }
        ]
      },
      "EmploymentHistory": {
        "ExperienceSummary": {
          "Description": "The candidate is experienced in the management of:  Information Technology (Project Management). The candidate has 10 years of work experience, with 10 years of management experience, including a mid-level position.",
          "MonthsOfWorkExperience": 115,
          "MonthsOfManagementExperience": 115,
          "ExecutiveType": "BUSINESS_DEV",
          "AverageMonthsPerEmployer": 28,
          "FulltimeDirectHirePredictiveIndex": 85,
          "ManagementStory": "Starting on 10/1/2017, the candidate held the following low-level management position for 3 years and 2 months:\n\tTitle: Project Manager for AJ Enterprise\nStarting on 4/1/2016, the candidate held the following mid-level management position for 18 months:\n\tTitle: Business Development Manager for UDX Pvt Ltd\nStarting on 6/1/2011, the candidate held the following low-level management position for 2 years and 11 months:\n\tTitle: Project Manager for Voltage Infra Pvt Ltd\nStarting on 6/1/2009, the candidate held the following low-level management position for 2 years:\n\tTitle: Project Manager for SMS Infra Pvt Ltd",
          "CurrentManagementLevel": "low-level",
          "ManagementScore": 55
        },
        "Positions": [
          {
            "Id": "POS-1",
            "Employer": {
              "Name": {
                "Probability": "Confident",
                "Raw": "AJ Enterprise",
                "Normalized": "AJ Enterprise"
              },
              "Location": {
                "CountryCode": "AU",
                "PostalCode": "4810",
                "Regions": [
                  "QLD"
                ],
                "Municipality": "Townsville"
              }
            },
            "IsSelfEmployed": false,
            "IsCurrent": false,
            "JobTitle": {
              "Raw": "Project Manager",
              "Normalized": "Project Manager",
              "Probability": "Confident"
            },
            "StartDate": {
              "Date": "2017-10-01",
              "IsCurrentDate": false,
              "FoundYear": true,
              "FoundMonth": true,
              "FoundDay": false
            },
            "EndDate": {
              "Date": "2020-12-01",
              "IsCurrentDate": false,
              "FoundYear": true,
              "FoundMonth": true,
              "FoundDay": false
            },
            "JobType": "directHire",
            "JobLevel": "Experienced (non-manager)",
            "TaxonomyPercentage": 0,
            "Description": "4810 Australia"
          },
          {
            "Id": "POS-2",
            "Employer": {
              "Name": {
                "Probability": "Confident",
                "Raw": "UDX Pvt Ltd",
                "Normalized": "UDX"
              },
              "Location": {
                "CountryCode": "IN",
                "Regions": [
                  "Karnataka"
                ],
                "Municipality": "Bangalore"
              }
            },
            "IsSelfEmployed": false,
            "IsCurrent": false,
            "JobTitle": {
              "Raw": "Business Development Manager",
              "Normalized": "Business Development Manager",
              "Probability": "Confident"
            },
            "StartDate": {
              "Date": "2016-04-01",
              "IsCurrentDate": false,
              "FoundYear": true,
              "FoundMonth": true,
              "FoundDay": false
            },
            "EndDate": {
              "Date": "2017-09-30",
              "IsCurrentDate": false,
              "FoundYear": true,
              "FoundMonth": true,
              "FoundDay": false
            },
            "JobType": "directHire",
            "JobLevel": "Manager",
            "TaxonomyPercentage": 0
          },
          {
            "Id": "POS-3",
            "Employer": {
              "Name": {
                "Probability": "Confident",
                "Raw": "Voltage Infra Pvt Ltd",
                "Normalized": "Voltage Infra"
              }
            },
            "IsSelfEmployed": false,
            "IsCurrent": false,
            "JobTitle": {
              "Raw": "Project Manager",
              "Normalized": "Project Manager",
              "Probability": "Confident"
            },
            "StartDate": {
              "Date": "2011-06-01",
              "IsCurrentDate": false,
              "FoundYear": true,
              "FoundMonth": true,
              "FoundDay": false
            },
            "EndDate": {
              "Date": "2014-05-01",
              "IsCurrentDate": false,
              "FoundYear": true,
              "FoundMonth": true,
              "FoundDay": false
            },
            "JobType": "directHire",
            "JobLevel": "Experienced (non-manager)",
            "TaxonomyPercentage": 0
          },
          {
            "Id": "POS-4",
            "Employer": {
              "Name": {
                "Probability": "Confident",
                "Raw": "SMS Infra Pvt Ltd",
                "Normalized": "SMS Infra"
              },
              "Location": {
                "CountryCode": "IN",
                "Regions": [
                  "Maharashtra"
                ],
                "Municipality": "Pune"
              }
            },
            "IsSelfEmployed": false,
            "IsCurrent": false,
            "JobTitle": {
              "Raw": "Project Manager",
              "Normalized": "Project Manager",
              "Probability": "Confident"
            },
            "StartDate": {
              "Date": "2009-06-01",
              "IsCurrentDate": false,
              "FoundYear": true,
              "FoundMonth": true,
              "FoundDay": false
            },
            "EndDate": {
              "Date": "2011-06-01",
              "IsCurrentDate": false,
              "FoundYear": true,
              "FoundMonth": true,
              "FoundDay": false
            },
            "JobType": "directHire",
            "TaxonomyName": "Sales",
            "SubTaxonomyName": "General",
            "JobLevel": "Entry Level",
            "TaxonomyPercentage": 29,
            "Description": "Responsibilities:\n•   Understand the customer's problems, perform different analysis methods to analyze their\nbusinesses from business as well as functional side.\n•   Analyze existing technology in their processes and design new desired solution as per current\nmarketing conditions.\n•   Find out the risk to mitigate its impact and identify opportunity. Check on feasibility and business impacts of various solution options.\n•   Create project backlog and then break it into user stories with acceptance criteria.\n\n•   Define a project vision and sets of project strategy. Outlines what the project success looks\n\nlike.\n•   Work on iteration period for each sprint and decide complete timeline for the project.\n\n•   Create different traceability metrics to trace progress of each sprint. And track complete\nproject lifecycle.\n•   Managed project elements for multiple initiatives from initial planning to project roll outs.\n•   Gather  a  performed  knowledge  of  the  project, market  and  customer  to  prepare  project\ndocuments.\n•   Identify the stakeholders and work more closely with external stakeholders.\n•   Create a project roadmap that outlines the vision, direction and priorities.\n•   Design Training program of salesforce for the Sales and Marketing Teams on customer end\n•   Monitored team's adoption rates and responded as needed. Providing them with training\nsessions, communication and documentation as needed.\n\nProject accomplished:\n\nProject # 1\nProject Name: Dream Australia\nEnvironment: Salesforce.com Platform\nClient: GTRS\nDescription: GTRS is parent company of AJ Enterprise mainly works as a job consultancy,\n\nprovides jobs and internship programs in the industry with their domain specialization makes\n\njob seekers. Students, fresher, or working professional those who want to migrate in Australia GTRS provides opportunities. They have CRM function for business control.\nCompany  has to deals with tasks like Getting customers, different country operations, channel\npartners, business  partners, employees, marketing  and  sales  teams, Marketing  Plans  like\ncampaigns, events  on  daily  basis.  Channelize  complete  path  from  lead  generation  to  lead\nconversion and putting those leads into the right industry.\n\n\nProject # 2\nProject Name: Arise Solar CRM\nClient: Arise Solar\nEnvironment: Salesforce.com Platform\n\nDescription: Arise  Solar is mainly into the Solar appliances business, where they sale the solar products to the customer based the requirements. Arise Solar CRM solution is for sales & marketing aspects to complete the selling and buying Cycle. The global CRM process developed in Arise  Solar starts with the marketing department where they create campaigns to target\ndifferent customers, generate leads or just to create new leads to be managed and qualified by\nthe  sales  team.  An  Opportunity  is  usually  used  to  track  a  \"Deal\"  from  its  early  stages  to completion, it hold various information like Products category, total sale, stock statement, new\narrivals, Delivery pending etc.\n\nProject # 3\nProject Name: Clare CRM\nClient: Clare Hospitals, Australia\nEnvironment: Salesforce.com\nDescription: Scope  was  to  create  Hospital  Management, Scheduler, Billing, Inventory  and Reporting application that resides on the salesforce.com platform. The patient module provides\nfunctionality to create and edit patient's details. Assign doctors, nurses, rooms for procedures. It also provides tracking features like Audit Trails, Communication logs, Alerts and reports. The\nscheduler module provides the functionality to create and track appointments for the patients\nwith doctors for consult, surgery, etc. Doctors could specify there preferred working hours and also the  preferred  procedures that the  will  do  at  those  times.  There  is  also  facility to  view\nunattended appointments.\n\nProject # 4\nProject Name: Autobarn CRM\nClient: Autobarn, Australia\nEnvironment: Salesforce.com\nDescription: Complete automobile solution for all types of vehicle. Whatever your automotive\ndream is, Autobarn can get you there. With over 150 stores across Australia, Autobarn can help\nyou get precisely what you want. For them, it's not just about selling products. Their staff happily\nassists and inquires to know your needs like what kind of car you have or want to purchase.\nAutobarn CRM process starts with channelizing their marketing campaign and then manage the complete lead conversion process to find  the prospects leads and create account. Complete\nautomated sales process that increase the pace of customer handling and quick delivery makes the customers happy helps to retain and gain new customers.\n\n\nUDX Pvt Ltd, - Business Development Manager\nProject Name: LAW Entrance Coaching\nEnvironment: Salesforce.com Platform\nDescription: UDX is mainly in all LAW related coaching business. Provides different courses,\ncovers different exam, and Judges entrance coaching. Salesforce CRM control maximum business with different objects. Business deals with different study material printers, material suppliers,\nmarketing  channel  partners, students, colleges, schools, faculties, research  team, purchase\ndepartment and Franchise partners.\nResponsibilities:\n•   Identified  and  pursued  valuable  business  opportunities  to  generate  new  revenue  and\n\nimprove bottom line profit.\n•   Understanding the business requirements and detailed solution definition.\n•   Customization of the organization profile, creation of custom objects, custom fields, formula\nfields as per the requirements.\n•   Evaluates data entry, import processes, and insures proper data quality standards along with Apex data loader\n•   Works  closely  with  management  and  other  department  heads  to  accomplish  requested\ndeliverables using salesforce.com CRM application.\n•   Propose franchise development plan and create new franchises.\n•   Work closely with marketing and sales team for campaigns and events.\n\n\nVoltage Infra Pvt Ltd, - Project Manager\n•   E2E Project development: Planning, design, execution, monitoring, controlling and closure of a project.\n•   Complete erection and commissioning of Substation and EHV transmission line.\n•   Project Planning & develop outsourcing model for internal sub projects\n•   Erection & commissioning  of  different  devices  for  controlling, safety, switching,\ncommunicating such as transformer, breaker, Isolator, CT/PT, LA etc.\n•   Prepare and develop testing plan for complete project\n•   Prepare joint measurement sheet for billing with client and also do subcontractors billing\n•   Communicate with all the stakeholders: State Electricity Board, suppliers, Sub-contractors,\nlabors\n•   Handle right of way issues and permissions from different local/central Government bodies.\n\n\nSMS Infra Pvt Ltd, - Sub Divisional In charge\n•   Allocate the work and distribute the area for individual contractors\n•   Train resources and Supervise work of 28 sub-subcontractors\n•   Construction of overhead Distribution lines & Distribution Transformer, Underground cable\n•   Co-ordinate with local government bodies and Electricity board\n•   Look after measurement of contractor work for billing with quality check\n•   Organize team building activities & motivate team to finish the project before deadlines\n•   Awarded as fastest Project Completion Award 2010"
          }
        ]
      },
      "SkillsData": [
        {
          "Root": "Sovren",
          "Taxonomies": [
            {
              "Id": "10",
              "Name": "Information Technology",
              "PercentOfOverall": 56,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "199",
                  "SubTaxonomyName": "Project Management",
                  "PercentOfOverall": 51,
                  "PercentOfParent": 91,
                  "Skills": [
                    {
                      "Id": "005803",
                      "Name": "Project Development",
                      "FoundIn": [
                        {
                          "SectionType": "SKILLS"
                        },
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    },
                    {
                      "Id": "005812",
                      "Name": "Project Lifecycle",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    },
                    {
                      "Id": "022909",
                      "Name": "Project Manager",
                      "FoundIn": [
                        {
                          "SectionType": "PERSONAL INTERESTS AND ACCOMPLISHMENTS"
                        },
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-1"
                        },
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-3"
                        },
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 97
                      },
                      "LastUsed": {
                        "Value": "2020-12-01"
                      }
                    },
                    {
                      "Id": "005820",
                      "Name": "Project Planning",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "251",
                  "SubTaxonomyName": "Config Deploy Upgrade Migrate",
                  "PercentOfOverall": 1,
                  "PercentOfParent": 2,
                  "Skills": [
                    {
                      "Id": "022159",
                      "Name": "Change Management",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    },
                    {
                      "Id": "023631",
                      "Name": "Deployment",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    },
                    {
                      "Id": "020238",
                      "Name": "ITIL",
                      "FoundIn": [
                        {
                          "SectionType": "CERTIFICATIONS"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "556",
                  "SubTaxonomyName": "Privacy and Data Security",
                  "PercentOfOverall": 1,
                  "PercentOfParent": 2,
                  "Skills": [
                    {
                      "Id": "5551315",
                      "Name": "ISO",
                      "FoundIn": [
                        {
                          "SectionType": "CERTIFICATIONS"
                        }
                      ],
                      "ExistsInText": true
                    },
                    {
                      "Id": "5551260",
                      "Name": "ITIL",
                      "FoundIn": [
                        {
                          "SectionType": "CERTIFICATIONS"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "349",
                  "SubTaxonomyName": "Operations, Monitoring and Software Management",
                  "PercentOfOverall": 1,
                  "PercentOfParent": 1,
                  "Skills": [
                    {
                      "Id": "3490036",
                      "Name": "ITIL",
                      "FoundIn": [
                        {
                          "SectionType": "CERTIFICATIONS"
                        }
                      ],
                      "ExistsInText": true
                    },
                    {
                      "Id": "081178",
                      "Name": "SMS",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "550",
                  "SubTaxonomyName": "Cloud Computing",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 1,
                  "Skills": [
                    {
                      "Id": "5500380",
                      "Name": "Salesforce.Com",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "198",
                  "SubTaxonomyName": "Network",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 1,
                  "Skills": [
                    {
                      "Id": "1980041",
                      "Name": "Switching",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "347",
                  "SubTaxonomyName": "Telephony",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 1,
                  "Skills": [
                    {
                      "Id": "026854",
                      "Name": "APEX",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "200",
                  "SubTaxonomyName": "QA and QC",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 1,
                  "Skills": [
                    {
                      "Id": "015002",
                      "Name": "Data Quality",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "252",
                  "SubTaxonomyName": "Prebuilt Software",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 0,
                  "Skills": [
                    {
                      "Id": "022475",
                      "Name": "Billing",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "195",
                  "SubTaxonomyName": "ERP and CRM",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 0,
                  "Skills": [
                    {
                      "Id": "014101",
                      "Name": "CRM",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "20",
              "Name": "Sales",
              "PercentOfOverall": 18,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "105",
                  "SubTaxonomyName": "General",
                  "PercentOfOverall": 18,
                  "PercentOfParent": 100,
                  "Skills": [
                    {
                      "Id": "023757",
                      "Name": "Business Development",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-2"
                        },
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 42
                      },
                      "LastUsed": {
                        "Value": "2017-09-30"
                      }
                    },
                    {
                      "Id": "030830",
                      "Name": "Sales Team",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    },
                    {
                      "Id": "030881",
                      "Name": "Selling Products",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "14",
              "Name": "Marketing",
              "PercentOfOverall": 9,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "249",
                  "SubTaxonomyName": "General",
                  "PercentOfOverall": 9,
                  "PercentOfParent": 96,
                  "Skills": [
                    {
                      "Id": "021241",
                      "Name": "Marketing",
                      "FoundIn": [
                        {
                          "SectionType": "EDUCATION",
                          "Id": "DEG-1"
                        },
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2016-01-01"
                      }
                    },
                    {
                      "Id": "021246",
                      "Name": "Marketing Department",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "585",
                  "SubTaxonomyName": "Product",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 2,
                  "Skills": [
                    {
                      "Id": "1400308",
                      "Name": "Marketing Campaign",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "592",
                  "SubTaxonomyName": "Marketing Communications",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 2,
                  "Skills": [
                    {
                      "Id": "1400348",
                      "Name": "Marketing Campaign",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "5",
              "Name": "Engineering",
              "PercentOfOverall": 3,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "268",
                  "SubTaxonomyName": "RF",
                  "PercentOfOverall": 2,
                  "PercentOfParent": 66,
                  "Skills": [
                    {
                      "Id": "022904",
                      "Name": "Telecom",
                      "FoundIn": [
                        {
                          "SectionType": "EDUCATION",
                          "Id": "DEG-1"
                        }
                      ],
                      "ExistsInText": true,
                      "LastUsed": {
                        "Value": "2016-01-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "308",
                  "SubTaxonomyName": "Power Engineering",
                  "PercentOfOverall": 1,
                  "PercentOfParent": 32,
                  "Skills": [
                    {
                      "Id": "024955",
                      "Name": "Power System",
                      "FoundIn": [
                        {
                          "SectionType": "PERSONAL INTERESTS AND ACCOMPLISHMENTS"
                        }
                      ],
                      "ExistsInText": true
                    },
                    {
                      "Id": "080360",
                      "Name": "Substation",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    },
                    {
                      "Id": "022995",
                      "Name": "Transmission Line",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "144",
                  "SubTaxonomyName": "Computer Hardware",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 3,
                  "Skills": [
                    {
                      "Id": "080783",
                      "Name": "Substation",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "22",
              "Name": "Construction Non-Laborer",
              "PercentOfOverall": 2,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "389",
                  "SubTaxonomyName": "General Tasks and Equipment",
                  "PercentOfOverall": 1,
                  "PercentOfParent": 55,
                  "Skills": [
                    {
                      "Id": "023575",
                      "Name": "PRE-Construction",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "381",
                  "SubTaxonomyName": "Supervision",
                  "PercentOfOverall": 1,
                  "PercentOfParent": 45,
                  "Skills": [
                    {
                      "Id": "022283",
                      "Name": "Construction Management",
                      "FoundIn": [
                        {
                          "SectionType": "SKILLS"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                }
              ]
            },
            {
              "Id": "16",
              "Name": "Telecommunications",
              "PercentOfOverall": 1,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "317",
                  "SubTaxonomyName": "Standards, Protocols, Technologies",
                  "PercentOfOverall": 1,
                  "PercentOfParent": 98,
                  "Skills": [
                    {
                      "Id": "081157",
                      "Name": "SMS",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    },
                    {
                      "Id": "022903",
                      "Name": "Telecom",
                      "FoundIn": [
                        {
                          "SectionType": "EDUCATION",
                          "Id": "DEG-1"
                        }
                      ],
                      "ExistsInText": true,
                      "LastUsed": {
                        "Value": "2016-01-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "315",
                  "SubTaxonomyName": "Cabling and Related",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 2,
                  "Skills": [
                    {
                      "Id": "009856",
                      "Name": "Transmission Line",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "45",
              "Name": "Transmission & Distribution",
              "PercentOfOverall": 1,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "326",
                  "SubTaxonomyName": "Transmission",
                  "PercentOfOverall": 1,
                  "PercentOfParent": 68,
                  "Skills": [
                    {
                      "Id": "015513",
                      "Name": "Distribution Lines",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    },
                    {
                      "Id": "015903",
                      "Name": "EHV",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    },
                    {
                      "Id": "022360",
                      "Name": "Substation",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    },
                    {
                      "Id": "022994",
                      "Name": "Transmission Line",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "324",
                  "SubTaxonomyName": "Overhead",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 32,
                  "Skills": [
                    {
                      "Id": "004186",
                      "Name": "Overhead Distribution",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "90",
              "Name": "Personal Attributes",
              "PercentOfOverall": 1,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "528",
                  "SubTaxonomyName": "Attitude",
                  "PercentOfOverall": 1,
                  "PercentOfParent": 100,
                  "Skills": [
                    {
                      "Id": "007739",
                      "Name": "Self Motivated",
                      "ExistsInText": false
                    }
                  ]
                }
              ]
            },
            {
              "Id": "29",
              "Name": "Hardware Engineering",
              "PercentOfOverall": 1,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "713",
                  "SubTaxonomyName": "EMC / SI",
                  "PercentOfOverall": 1,
                  "PercentOfParent": 100,
                  "Skills": [
                    {
                      "Id": "5000006",
                      "Name": "EMC",
                      "FoundIn": [
                        {
                          "SectionType": "CERTIFICATIONS"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                }
              ]
            },
            {
              "Id": "1",
              "Name": "Administrative or Clerical",
              "PercentOfOverall": 1,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "109",
                  "SubTaxonomyName": "Document-centric",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 42,
                  "Skills": [
                    {
                      "Id": "014123",
                      "Name": "Data Entry",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "945",
                  "SubTaxonomyName": "Machines",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 42,
                  "Skills": [
                    {
                      "Id": "0054452",
                      "Name": "Printers",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "111",
                  "SubTaxonomyName": "Recordkeeping and Supplies",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 11,
                  "Skills": [
                    {
                      "Id": "012256",
                      "Name": "Buying",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "110",
                  "SubTaxonomyName": "Billing and Collections",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 5,
                  "Skills": [
                    {
                      "Id": "022474",
                      "Name": "Billing",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "7",
              "Name": "Finance",
              "PercentOfOverall": 1,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "709",
                  "SubTaxonomyName": "Global Security",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 36,
                  "Skills": [
                    {
                      "Id": "7000101",
                      "Name": "Vendor Management",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "708",
                  "SubTaxonomyName": "Procurement",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 36,
                  "Skills": [
                    {
                      "Id": "7000088",
                      "Name": "Vendor Management",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "246",
                  "SubTaxonomyName": "Treasury",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 27,
                  "Skills": [
                    {
                      "Id": "012194",
                      "Name": "Business Analysis",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                }
              ]
            },
            {
              "Id": "71",
              "Name": "Strategy and Planning",
              "PercentOfOverall": 1,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "876",
                  "SubTaxonomyName": "Workflow and Processes",
                  "PercentOfOverall": 1,
                  "PercentOfParent": 100,
                  "Skills": [
                    {
                      "Id": "024469",
                      "Name": "Business Analysis",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    },
                    {
                      "Id": "022626",
                      "Name": "Business Requirements",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "32",
              "Name": "Degreed Accounting",
              "PercentOfOverall": 1,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "962",
                  "SubTaxonomyName": "Reporting",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 56,
                  "Skills": [
                    {
                      "Id": "022891",
                      "Name": "Budget",
                      "FoundIn": [
                        {
                          "SectionType": "PERSONAL INTERESTS AND ACCOMPLISHMENTS"
                        },
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "942",
                  "SubTaxonomyName": "Auditing",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 44,
                  "Skills": [
                    {
                      "Id": "005584",
                      "Name": "Audit",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "9",
              "Name": "Human Resources",
              "PercentOfOverall": 1,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "579",
                  "SubTaxonomyName": "HR Management",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 50,
                  "Skills": [
                    {
                      "Id": "9000169",
                      "Name": "Change Management",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    },
                    {
                      "Id": "9000164",
                      "Name": "Coaching",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "581",
                  "SubTaxonomyName": "Organization Development",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 28,
                  "Skills": [
                    {
                      "Id": "9000213",
                      "Name": "Change Management",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "583",
                  "SubTaxonomyName": "Talent Sourcing",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 22,
                  "Skills": [
                    {
                      "Id": "9000267",
                      "Name": "Customer Relationship Management",
                      "ExistsInText": false,
                      "Variations": [
                        {
                          "Id": "9000268",
                          "Name": "CRM",
                          "FoundIn": [
                            {
                              "SectionType": "WORK HISTORY",
                              "Id": "POS-4"
                            }
                          ],
                          "ExistsInText": true,
                          "MonthsExperience": {
                            "Value": 24
                          },
                          "LastUsed": {
                            "Value": "2011-06-01"
                          }
                        }
                      ],
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      },
                      "ChildrenMonthsExperience": {
                        "Value": 24
                      },
                      "ChildrenLastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "34",
              "Name": "Business Operations and General Business",
              "PercentOfOverall": 1,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "436",
                  "SubTaxonomyName": "Management Activities or Functions",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 54,
                  "Skills": [
                    {
                      "Id": "012977",
                      "Name": "Change Management",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    },
                    {
                      "Id": "003875",
                      "Name": "Operations",
                      "FoundIn": [
                        {
                          "SectionType": "SKILLS"
                        },
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "437",
                  "SubTaxonomyName": "General Skills and Activities",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 46,
                  "Skills": [
                    {
                      "Id": "021737",
                      "Name": "Metrics",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "80",
              "Name": "General Management",
              "PercentOfOverall": 1,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "517",
                  "SubTaxonomyName": "People Oriented",
                  "PercentOfOverall": 1,
                  "PercentOfParent": 87,
                  "Skills": [
                    {
                      "Id": "021625",
                      "Name": "Mentor",
                      "FoundIn": [
                        {
                          "SectionType": "PERSONAL INTERESTS AND ACCOMPLISHMENTS"
                        }
                      ],
                      "ExistsInText": true
                    },
                    {
                      "Id": "009221",
                      "Name": "Team Building",
                      "FoundIn": [
                        {
                          "SectionType": "PERSONAL INTERESTS AND ACCOMPLISHMENTS"
                        },
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "519",
                  "SubTaxonomyName": "Management and Management Tasks",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 13,
                  "Skills": [
                    {
                      "Id": "005802",
                      "Name": "Project Development",
                      "FoundIn": [
                        {
                          "SectionType": "SKILLS"
                        },
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "97",
              "Name": "Supply Chain and Logistics",
              "PercentOfOverall": 1,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "459",
                  "SubTaxonomyName": "Inventory",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 56,
                  "Skills": [
                    {
                      "Id": "020086",
                      "Name": "Inventory",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "458",
                  "SubTaxonomyName": "Purchasing",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 44,
                  "Skills": [
                    {
                      "Id": "023098",
                      "Name": "Buying",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    },
                    {
                      "Id": "010474",
                      "Name": "Vendor Management",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                }
              ]
            },
            {
              "Id": "92",
              "Name": "Knowledge and Learning Management",
              "PercentOfOverall": 1,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "903",
                  "SubTaxonomyName": "General Knowledge and Learning Management",
                  "PercentOfOverall": 1,
                  "PercentOfParent": 100,
                  "Skills": [
                    {
                      "Id": "200053",
                      "Name": "Coaching",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    },
                    {
                      "Id": "200052",
                      "Name": "Mentor",
                      "FoundIn": [
                        {
                          "SectionType": "PERSONAL INTERESTS AND ACCOMPLISHMENTS"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                }
              ]
            },
            {
              "Id": "31",
              "Name": "Written Communications",
              "PercentOfOverall": 0,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "429",
                  "SubTaxonomyName": "Specs and Documentation",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 100,
                  "Skills": [
                    {
                      "Id": "022620",
                      "Name": "Documentation",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "11",
              "Name": "General Non-Skilled Labor",
              "PercentOfOverall": 0,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "301",
                  "SubTaxonomyName": "Drivers",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 100,
                  "Skills": [
                    {
                      "Id": "020850",
                      "Name": "Loader",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "89",
              "Name": "Bookkeeping, Office Management",
              "PercentOfOverall": 0,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "533",
                  "SubTaxonomyName": "Bookeeping Tasks",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 100,
                  "Skills": [
                    {
                      "Id": "011553",
                      "Name": "Billing",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    },
                    {
                      "Id": "012120",
                      "Name": "Budget",
                      "FoundIn": [
                        {
                          "SectionType": "PERSONAL INTERESTS AND ACCOMPLISHMENTS"
                        },
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                }
              ]
            },
            {
              "Id": "26",
              "Name": "Power Engineering",
              "PercentOfOverall": 0,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "925",
                  "SubTaxonomyName": "General Power Related",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 100,
                  "Skills": [
                    {
                      "Id": "022359",
                      "Name": "Substation",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    },
                    {
                      "Id": "022993",
                      "Name": "Transmission Line",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      "Certifications": [
        {
          "Name": "BCMS Implementation  ISO 22301:2012",
          "MatchedFromList": false,
          "IsVariation": false
        },
        {
          "Name": "Business Process Framework (eTOM)",
          "MatchedFromList": false,
          "IsVariation": false
        },
        {
          "Name": "Business Process Framework",
          "MatchedFromList": false,
          "IsVariation": true
        },
        {
          "Name": "EMC Academic  Associate - ISM",
          "MatchedFromList": false,
          "IsVariation": false
        },
        {
          "Name": "ITIL V3 Foundation",
          "MatchedFromList": false,
          "IsVariation": false
        },
        {
          "Name": "easy path for the",
          "MatchedFromList": false,
          "IsVariation": false
        },
        {
          "Name": "ITIL V3",
          "MatchedFromList": true,
          "IsVariation": true
        }
      ],
      "LanguageCompetencies": [
        {
          "Language": "English",
          "LanguageCode": "en",
          "FoundInContext": "[RESUME_LANGUAGE]"
        }
      ],
      "Achievements": [
        "Awarded as fastest Project Completion Award 2010",
        "Complete all the Projects well within the timeline",
        "Completed Hiwarwadi Project for Regen Powertech of of 52 Cr within 8 months well before",
        "Finished Pen subdivision and Matheran Projects on time and under budget",
        "Trained and mentor a team of 18 juniors",
        "Promoted to Project Manager with a year of employment",
        "Received numerous letters of recommendation and overall appreciation from customers",
        "Founder and Secretory of URSDAY social organization",
        "Complete Outbound leadership and Team Building camp",
        "Complete the adventurous camp at \"Palasful\" Chikhaldhara",
        "Organize& Attend Seminar on \"Power System and Protection, Personality Development\"",
        "Main organizer of Nagpur level student and teacher get together"
      ],
      "QualificationsSummary": "SKILLS\n\n.   Salesforce(SFDC)\n.   SFDC Business  Analyst\n.   Project Development\n\n.   Construction management\n.   Negotiation  expert\n.   Multi-site operations\n.   Project  planning",
      "Hobbies": "•   Meditation\n\n•   Social work\n\n•   Making sketches\n\n•   Bamboo and wax work\n\n•   Music\n•   Cricket",
      "ResumeMetadata": {
        "FoundSections": [
          {
            "FirstLineNumber": 8,
            "LastLineNumber": 19,
            "SectionType": "SKILLS",
            "HeaderTextFound": "SKILLS"
          },
          {
            "FirstLineNumber": 20,
            "LastLineNumber": 33,
            "SectionType": "EDUCATION",
            "HeaderTextFound": "EDUCATION"
          },
          {
            "FirstLineNumber": 34,
            "LastLineNumber": 45,
            "SectionType": "CERTIFICATIONS",
            "HeaderTextFound": "CERTIFICATIONS"
          },
          {
            "FirstLineNumber": 46,
            "LastLineNumber": 57,
            "SectionType": "HOBBIES",
            "HeaderTextFound": "HOBBIES"
          },
          {
            "FirstLineNumber": 58,
            "LastLineNumber": 218,
            "SectionType": "WORK HISTORY",
            "HeaderTextFound": "PROFESSIONAL\tSUMMARY"
          },
          {
            "FirstLineNumber": 219,
            "LastLineNumber": 234,
            "SectionType": "PERSONAL INTERESTS AND ACCOMPLISHMENTS",
            "HeaderTextFound": "Accomplishments"
          }
        ],
        "ResumeQuality": [
          {
            "Level": "Fatal Problems Found",
            "Findings": [
              {
                "QualityCode": "433",
                "Message": "We detected that this document contained at least some data that was laid out as columns or tables. We rearranged that data to make it more usable. NEVER use columns or tables in a resume."
              }
            ]
          },
          {
            "Level": "Major Issues Found",
            "Findings": [
              {
                "QualityCode": "300",
                "Message": "You should not use the PDF format for your resume. Due to inherent limitations with text extraction from PDFs, you are less likely to get a job when using a PDF resume."
              },
              {
                "QualityCode": "302",
                "Message": "A first and last name was not found in the contact information. A resume should always include the candidate's first and last name."
              }
            ]
          },
          {
            "Level": "Data Missing",
            "Findings": [
              {
                "QualityCode": "213",
                "Message": "A street level address was not found in the contact information. A full contact address should always be included in a resume as it allows for location based searches."
              }
            ]
          },
          {
            "Level": "Suggested Improvements",
            "Findings": [
              {
                "QualityCode": "112",
                "Message": "The following section was identified as a skills section type: 'SKILLS'. Skills should not be in a separate section, but instead, each skill should be included in the descriptions of work history or education. THIS IS INCREDIBLY IMPORTANT FOR AI MATCHING ALGORITHMS"
              }
            ]
          }
        ],
        "ReservedData": {
          "Phones": [
            "9657846601"
          ],
          "EmailAddresses": [
            "tmbodele1223@gmail.com"
          ],
          "Urls": [
            "Salesforce.com"
          ]
        },
        "PlainText": "Tikesh\tBodele\n\n@ tmbodele1223@gmail.com\nNagpur, MH 440022\n\n9657846601\n•\n\n\nSKILLS\n\n.   Salesforce(SFDC)\n.   SFDC Business  Analyst\n.   Project Development\n\n.   Construction management\n.   Negotiation  expert\n.   Multi-site operations\n.   Project  planning\n\n\nEDUCATION\n\n\n•   Symbiosis Institute of Telecom\n\nManagement, Pune MH. 2016\nMBA: Marketing\n\n•   Yashwantrao  Chavan College of\nEngineering, Nagpur MH. 2009\n\nBE: Electrical Engg\n\n\nCERTIFICATIONS\n\nITIL V3 Foundation,\n\nBCMS Implementation  ISO 22301:2012\n\nBusiness Process Framework (eTOM)\neasy path for the\nFundamentals\nEMC Academic  Associate - ISM\n\n\nHOBBIES\n\n•   Meditation\n\n•   Social work\n\n•   Making sketches\n\n•   Bamboo and wax work\n\n•   Music\n•   Cricket\nPROFESSIONAL\tSUMMARY\n\n•   Project Manager with total 9.9 years of experience in which 3 years on SFDC\n•   Experience in E2E Project Planning and execution, business analysis, Customer\nmanagement, Implementation and support experience with Salesforce.com.\n•   Experience in Deployment of change management in different organisation.\n\n•   Good hands on vendor management, handle multiple vendors same time.\n•   Highly  skilled  in  all  project  phases,  pre-construction  or  development,  E2E\nproject development. Successfully managed more than 9 diverse projects.\n•   Proactive leader skills in managing the project team to provide value to the\nclient by delivering quality projects on time and within budget.\n\nWORK\tHISTORY\n\n•   AJ Enterprise - Project Manager\t 10/2017- 12/2020\n\nSt Townsville QLD 4810 Australia\nUDX Pvt Ltd - Business Development Manager\t04/2016 - 09/2017\nBangalore, Karnataka.\n\n•   Voltage Infra Pvt Ltd - Project Manager\t  06/2011 - 05/2014\nPune, Maharashtra.\n•   SMS Infra Pvt Ltd - Sub Divisional In charge\t06/2009 - 06/2011\n\nPen, Maharashtra.\n\n\nAJ Enterprise - Project Manager\nResponsibilities:\n•   Understand the customer's problems, perform different analysis methods to analyze their\nbusinesses from business as well as functional side.\n•   Analyze existing technology in their processes and design new desired solution as per current\nmarketing conditions.\n•   Find out the risk to mitigate its impact and identify opportunity. Check on feasibility and\nbusiness impacts of various solution options.\n•   Create project backlog and then break it into user stories with acceptance criteria.\n\n•   Define a project vision and sets of project strategy. Outlines what the project success looks\n\nlike.\n•   Work on iteration period for each sprint and decide complete timeline for the project.\n\n•   Create different traceability metrics to trace progress of each sprint. And track complete\nproject lifecycle.\n•   Managed project elements for multiple initiatives from initial planning to project roll outs.\n•   Gather  a  performed  knowledge  of  the  project,  market  and  customer  to  prepare  project\ndocuments.\n•   Identify the stakeholders and work more closely with external stakeholders.\n•   Create a project roadmap that outlines the vision, direction and priorities.\n•   Design Training program of salesforce for the Sales and Marketing Teams on customer end\n•   Monitored team's adoption rates and responded as needed. Providing them with training\nsessions, communication and documentation as needed.\n\nProject accomplished:\n\nProject # 1\nProject Name: Dream Australia\nEnvironment: Salesforce.com Platform\nClient: GTRS\nDescription: GTRS is parent company of AJ Enterprise mainly works as a job consultancy,\n\nprovides jobs and internship programs in the industry with their domain specialization makes\n\njob seekers. Students, fresher, or working professional those who want to\nmigrate in Australia GTRS provides opportunities. They have CRM function for business control.\nCompany  has to deals with tasks like Getting customers, different country operations, channel\npartners,  business  partners,  employees,  marketing  and  sales  teams,  Marketing  Plans  like\ncampaigns,  events  on  daily  basis.  Channelize  complete  path  from  lead  generation  to  lead\nconversion and putting those leads into the right industry.\n\n\nProject # 2\n\nProject Name: Arise Solar CRM\n\nClient: Arise Solar\nEnvironment: Salesforce.com Platform\n\nDescription: Arise  Solar is mainly into the Solar appliances business, where they sale the\nsolar products to the customer based the requirements. Arise Solar CRM solution is for sales & marketing aspects to complete the selling and buying Cycle. The global CRM process developed\nin Arise  Solar starts with the marketing department where they create campaigns to target\ndifferent customers, generate leads or just to create new leads to be managed and qualified by\nthe  sales  team.  An  Opportunity  is  usually  used  to  track  a  \"Deal\"  from  its  early  stages  to\ncompletion, it hold various information like Products category, total sale, stock statement, new\narrivals, Delivery pending etc.\n\nProject # 3\nProject Name: Clare CRM\nClient: Clare Hospitals, Australia\nEnvironment: Salesforce.com\nDescription: Scope  was  to  create  Hospital  Management,  Scheduler,  Billing,  Inventory  and\nReporting application that resides on the salesforce.com platform. The patient module provides\nfunctionality to create and edit patient's details. Assign doctors, nurses, rooms for procedures. It\nalso provides tracking features like Audit Trails, Communication logs, Alerts and reports. The\nscheduler module provides the functionality to create and track appointments for the patients\nwith doctors for consult, surgery, etc. Doctors could specify there preferred working hours and\nalso the  preferred  procedures that the  will  do  at  those  times.  There  is  also  facility to  view\nunattended appointments.\n\nProject # 4\nProject Name: Autobarn CRM\nClient: Autobarn, Australia\nEnvironment: Salesforce.com\nDescription: Complete automobile solution for all types of vehicle. Whatever your automotive\ndream is, Autobarn can get you there. With over 150 stores across Australia, Autobarn can help\nyou get precisely what you want. For them, it's not just about selling products. Their staff happily\nassists and inquires to know your needs like what kind of car you have or want to purchase.\nAutobarn CRM process starts with channelizing their marketing campaign and then manage the\ncomplete lead conversion process to find  the prospects leads and create account. Complete\nautomated sales process that increase the pace of customer handling and quick delivery makes\nthe customers happy helps to retain and gain new customers.\n\n\nUDX Pvt Ltd, - Business Development Manager\nProject Name: LAW Entrance Coaching\nEnvironment: Salesforce.com Platform\nDescription: UDX is mainly in all LAW related coaching business. Provides different courses,\ncovers different exam, and Judges entrance coaching. Salesforce CRM control maximum business\nwith different objects. Business deals with different study material printers, material suppliers,\nmarketing  channel  partners,  students,  colleges,  schools,  faculties,  research  team,  purchase\ndepartment and Franchise partners.\nResponsibilities:\n•   Identified  and  pursued  valuable  business  opportunities  to  generate  new  revenue  and\n\nimprove bottom line profit.\n•   Understanding the business requirements and detailed solution definition.\n•   Customization of the organization profile, creation of custom objects, custom fields, formula\nfields as per the requirements.\n•   Evaluates data entry, import processes, and insures proper data quality standards along with\nApex data loader\n•   Works  closely  with  management  and  other  department  heads  to  accomplish  requested\ndeliverables using salesforce.com CRM application.\n•   Propose franchise development plan and create new franchises.\n•   Work closely with marketing and sales team for campaigns and events.\n\n\nVoltage Infra Pvt Ltd, - Project Manager\n•   E2E Project development: Planning, design, execution, monitoring, controlling and closure of\na project.\n•   Complete erection and commissioning of Substation and EHV transmission line.\n•   Project Planning & develop outsourcing model for internal sub projects\n•   Erection & commissioning  of  different  devices  for  controlling,  safety,  switching,\ncommunicating such as transformer, breaker, Isolator, CT/PT, LA etc.\n•   Prepare and develop testing plan for complete project\n•   Prepare joint measurement sheet for billing with client and also do subcontractors billing\n•   Communicate with all the stakeholders: State Electricity Board, suppliers, Sub-contractors,\nlabors\n•   Handle right of way issues and permissions from different local/central Government bodies.\n\n\nSMS Infra Pvt Ltd, - Sub Divisional In charge\n•   Allocate the work and distribute the area for individual contractors\n•   Train resources and Supervise work of 28 sub-subcontractors\n•   Construction of overhead Distribution lines & Distribution Transformer, Underground cable\n•   Co-ordinate with local government bodies and Electricity board\n•   Look after measurement of contractor work for billing with quality check\n•   Organize team building activities & motivate team to finish the project before deadlines\n•   Awarded as fastest Project Completion Award 2010\n\n\nAccomplishments\n•   Complete all the Projects well within the timeline.\n•   Completed Hiwarwadi Project for Regen Powertech of of 52 Cr within 8 months well before\ndeadline.\n•   Finished Pen subdivision and Matheran Projects on time and under budget.\n•   Trained and mentor a team of 18 juniors.\n•   Promoted to Project Manager with a year of employment.\n•   Received numerous letters of recommendation and overall appreciation from customers.\n\n\nAdditional Information\n•   Founder and Secretory of URSDAY social organization\n•   Complete Outbound leadership and Team Building camp\n•   Complete the adventurous camp at \"Palasful\" Chikhaldhara\n•   Organize& Attend Seminar on \"Power System and Protection, Personality Development\"\n•   Main organizer of Nagpur level student and teacher get together",
        "DocumentLanguage": "en",
        "DocumentCulture": "en-IN",
        "ParserSettings": "Coverage.MilitaryHistoryAndSecurityCredentials = True; Coverage.PatentsPublicationsAndSpeakingEvents = True; Coverage.PersonalAttributes = True; Coverage.Training = True; Culture.CountryCodeForUnitedKingdomIsUK = True; Culture.DefaultCountryCode = IN; Culture.DefaultCultureIsIndia = True; Culture.Language = English; Culture.PreferEnglishVersionIfTwoLanguagesInDocument = False; Data.UserDefinedParsing = False; OutputFormat.AssumeCompanyNameFromPrecedingJob = False; OutputFormat.ContactMethod.PackStyle = Split; OutputFormat.DateOutputStyle = ExplicitlyKnownDateInfoOnly; OutputFormat.NestJobsBasedOnDateRanges = True; OutputFormat.NormalizeRegions = False; OutputFormat.SimpleCustomLinkedIn = False; OutputFormat.SkillsStyle = Default; OutputFormat.StripParsedDataFromPositionHistoryDescription = True; OutputFormat.TelcomNumber.Style = Raw; OutputFormat.XmlFormat = HrXmlResume25",
        "DocumentLastModified": "2021-11-03",
        "SovrenSignature": [
          "8jv///////8="
        ]
      }
    },
    "RedactedResumeData": {
      "ContactInformation": {
        "Location": {
          "CountryCode": "IN",
          "PostalCode": "440022",
          "Regions": [
            "MH"
          ],
          "Municipality": "Nagpur"
        }
      },
      "Education": {
        "HighestDegree": {
          "Name": {
            "Raw": "MBA",
            "Normalized": "MBA"
          },
          "Type": "masters"
        },
        "EducationDetails": [
          {
            "Id": "DEG-1",
            "Text": "•   Symbiosis Institute of Telecom\n\nManagement, Pune MH. 2016\nMBA: Marketing",
            "SchoolName": {
              "Raw": "Symbiosis Institute of Telecom",
              "Normalized": "Symbiosis Institute of Telecom"
            },
            "SchoolType": "university",
            "Location": {
              "CountryCode": "IN",
              "Regions": [
                "MH"
              ],
              "Municipality": "Pune"
            },
            "Degree": {
              "Name": {
                "Raw": "MBA",
                "Normalized": "MBA"
              },
              "Type": "masters"
            },
            "Majors": [
              "Marketing"
            ],
            "LastEducationDate": {
              "Date": "2016-01-01",
              "IsCurrentDate": false,
              "FoundYear": true,
              "FoundMonth": false,
              "FoundDay": false
            }
          },
          {
            "Id": "DEG-2",
            "Text": "•   Yashwantrao  Chavan College of Engineering, Nagpur MH. 2009\n\nBE: Electrical Engg",
            "SchoolName": {
              "Raw": "Yashwantrao  Chavan College of Engineering",
              "Normalized": "Yashwantrao Chavan College of Engineering"
            },
            "SchoolType": "university",
            "Location": {
              "CountryCode": "IN",
              "Regions": [
                "MH"
              ],
              "Municipality": "Nagpur"
            },
            "Degree": {
              "Name": {
                "Raw": "BE",
                "Normalized": "bachelors"
              },
              "Type": "bachelors"
            },
            "Majors": [
              "Electrical Engg"
            ],
            "LastEducationDate": {
              "Date": "2009-01-01",
              "IsCurrentDate": false,
              "FoundYear": true,
              "FoundMonth": false,
              "FoundDay": false
            }
          }
        ]
      },
      "EmploymentHistory": {
        "ExperienceSummary": {
          "Description": "The candidate is experienced in the management of:  Information Technology (Project Management). The candidate has 10 years of work experience, with 10 years of management experience, including a mid-level position.",
          "MonthsOfWorkExperience": 115,
          "MonthsOfManagementExperience": 115,
          "ExecutiveType": "BUSINESS_DEV",
          "AverageMonthsPerEmployer": 28,
          "FulltimeDirectHirePredictiveIndex": 85,
          "ManagementStory": "Starting on 10/1/2017, the candidate held the following low-level management position for 3 years and 2 months:\n\tTitle: Project Manager for AJ Enterprise\nStarting on 4/1/2016, the candidate held the following mid-level management position for 18 months:\n\tTitle: Business Development Manager for UDX Pvt Ltd\nStarting on 6/1/2011, the candidate held the following low-level management position for 2 years and 11 months:\n\tTitle: Project Manager for Voltage Infra Pvt Ltd\nStarting on 6/1/2009, the candidate held the following low-level management position for 2 years:\n\tTitle: Project Manager for SMS Infra Pvt Ltd",
          "CurrentManagementLevel": "low-level",
          "ManagementScore": 55
        },
        "Positions": [
          {
            "Id": "POS-1",
            "Employer": {
              "Name": {
                "Probability": "Confident",
                "Raw": "AJ Enterprise",
                "Normalized": "AJ Enterprise"
              },
              "Location": {
                "CountryCode": "AU",
                "PostalCode": "4810",
                "Regions": [
                  "QLD"
                ],
                "Municipality": "Townsville"
              }
            },
            "IsSelfEmployed": false,
            "IsCurrent": false,
            "JobTitle": {
              "Raw": "Project Manager",
              "Normalized": "Project Manager",
              "Probability": "Confident"
            },
            "StartDate": {
              "Date": "2017-10-01",
              "IsCurrentDate": false,
              "FoundYear": true,
              "FoundMonth": true,
              "FoundDay": false
            },
            "EndDate": {
              "Date": "2020-12-01",
              "IsCurrentDate": false,
              "FoundYear": true,
              "FoundMonth": true,
              "FoundDay": false
            },
            "JobType": "directHire",
            "JobLevel": "Experienced (non-manager)",
            "TaxonomyPercentage": 0,
            "Description": "4810 Australia"
          },
          {
            "Id": "POS-2",
            "Employer": {
              "Name": {
                "Probability": "Confident",
                "Raw": "UDX Pvt Ltd",
                "Normalized": "UDX"
              },
              "Location": {
                "CountryCode": "IN",
                "Regions": [
                  "Karnataka"
                ],
                "Municipality": "Bangalore"
              }
            },
            "IsSelfEmployed": false,
            "IsCurrent": false,
            "JobTitle": {
              "Raw": "Business Development Manager",
              "Normalized": "Business Development Manager",
              "Probability": "Confident"
            },
            "StartDate": {
              "Date": "2016-04-01",
              "IsCurrentDate": false,
              "FoundYear": true,
              "FoundMonth": true,
              "FoundDay": false
            },
            "EndDate": {
              "Date": "2017-09-30",
              "IsCurrentDate": false,
              "FoundYear": true,
              "FoundMonth": true,
              "FoundDay": false
            },
            "JobType": "directHire",
            "JobLevel": "Manager",
            "TaxonomyPercentage": 0
          },
          {
            "Id": "POS-3",
            "Employer": {
              "Name": {
                "Probability": "Confident",
                "Raw": "Voltage Infra Pvt Ltd",
                "Normalized": "Voltage Infra"
              }
            },
            "IsSelfEmployed": false,
            "IsCurrent": false,
            "JobTitle": {
              "Raw": "Project Manager",
              "Normalized": "Project Manager",
              "Probability": "Confident"
            },
            "StartDate": {
              "Date": "2011-06-01",
              "IsCurrentDate": false,
              "FoundYear": true,
              "FoundMonth": true,
              "FoundDay": false
            },
            "EndDate": {
              "Date": "2014-05-01",
              "IsCurrentDate": false,
              "FoundYear": true,
              "FoundMonth": true,
              "FoundDay": false
            },
            "JobType": "directHire",
            "JobLevel": "Experienced (non-manager)",
            "TaxonomyPercentage": 0
          },
          {
            "Id": "POS-4",
            "Employer": {
              "Name": {
                "Probability": "Confident",
                "Raw": "SMS Infra Pvt Ltd",
                "Normalized": "SMS Infra"
              },
              "Location": {
                "CountryCode": "IN",
                "Regions": [
                  "Maharashtra"
                ],
                "Municipality": "Pune"
              }
            },
            "IsSelfEmployed": false,
            "IsCurrent": false,
            "JobTitle": {
              "Raw": "Project Manager",
              "Normalized": "Project Manager",
              "Probability": "Confident"
            },
            "StartDate": {
              "Date": "2009-06-01",
              "IsCurrentDate": false,
              "FoundYear": true,
              "FoundMonth": true,
              "FoundDay": false
            },
            "EndDate": {
              "Date": "2011-06-01",
              "IsCurrentDate": false,
              "FoundYear": true,
              "FoundMonth": true,
              "FoundDay": false
            },
            "JobType": "directHire",
            "TaxonomyName": "Sales",
            "SubTaxonomyName": "General",
            "JobLevel": "Entry Level",
            "TaxonomyPercentage": 29,
            "Description": "Responsibilities:\n•   Understand the customer's problems, perform different analysis methods to analyze their\nbusinesses from business as well as functional side.\n•   Analyze existing technology in their processes and design new desired solution as per current\nmarketing conditions.\n•   Find out the risk to mitigate its impact and identify opportunity. Check on feasibility and business impacts of various solution options.\n•   Create project backlog and then break it into user stories with acceptance criteria.\n\n•   Define a project vision and sets of project strategy. Outlines what the project success looks\n\nlike.\n•   Work on iteration period for each sprint and decide complete timeline for the project.\n\n•   Create different traceability metrics to trace progress of each sprint. And track complete\nproject lifecycle.\n•   Managed project elements for multiple initiatives from initial planning to project roll outs.\n•   Gather  a  performed  knowledge  of  the  project, market  and  customer  to  prepare  project\ndocuments.\n•   Identify the stakeholders and work more closely with external stakeholders.\n•   Create a project roadmap that outlines the vision, direction and priorities.\n•   Design Training program of salesforce for the Sales and Marketing Teams on customer end\n•   Monitored team's adoption rates and responded as needed. Providing them with training\nsessions, communication and documentation as needed.\n\nProject accomplished:\n\nProject # 1\nProject Name: Dream Australia\nEnvironment:    ~~~~~~~~~   Platform\nClient: GTRS\nDescription: GTRS is parent company of AJ Enterprise mainly works as a job consultancy,\n\nprovides jobs and internship programs in the industry with their domain specialization makes\n\njob seekers. Students, fresher, or working professional those who want to migrate in Australia GTRS provides opportunities. They have CRM function for business control.\nCompany  has to deals with tasks like Getting customers, different country operations, channel\npartners, business  partners, employees, marketing  and  sales  teams, Marketing  Plans  like\ncampaigns, events  on  daily  basis.  Channelize  complete  path  from  lead  generation  to  lead\nconversion and putting those leads into the right industry.\n\n\nProject # 2\nProject Name: Arise Solar CRM\nClient: Arise Solar\nEnvironment:    ~~~~~~~~~   Platform\n\nDescription: Arise  Solar is mainly into the Solar appliances business, where they sale the solar products to the customer based the requirements. Arise Solar CRM solution is for sales & marketing aspects to complete the selling and buying Cycle. The global CRM process developed in Arise  Solar starts with the marketing department where they create campaigns to target\ndifferent customers, generate leads or just to create new leads to be managed and qualified by\nthe  sales  team.  An  Opportunity  is  usually  used  to  track  a  \"Deal\"  from  its  early  stages  to completion, it hold various information like Products category, total sale, stock statement, new\narrivals, Delivery pending etc.\n\nProject # 3\nProject Name: Clare CRM\nClient: Clare Hospitals, Australia\nEnvironment:    ~~~~~~~~~  \nDescription: Scope  was  to  create  Hospital  Management, Scheduler, Billing, Inventory  and Reporting application that resides on the salesforce.com platform. The patient module provides\nfunctionality to create and edit patient's details. Assign doctors, nurses, rooms for procedures. It also provides tracking features like Audit Trails, Communication logs, Alerts and reports. The\nscheduler module provides the functionality to create and track appointments for the patients\nwith doctors for consult, surgery, etc. Doctors could specify there preferred working hours and also the  preferred  procedures that the  will  do  at  those  times.  There  is  also  facility to  view\nunattended appointments.\n\nProject # 4\nProject Name: Autobarn CRM\nClient: Autobarn, Australia\nEnvironment:    ~~~~~~~~~  \nDescription: Complete automobile solution for all types of vehicle. Whatever your automotive\ndream is, Autobarn can get you there. With over 150 stores across Australia, Autobarn can help\nyou get precisely what you want. For them, it's not just about selling products. Their staff happily\nassists and inquires to know your needs like what kind of car you have or want to purchase.\nAutobarn CRM process starts with channelizing their marketing campaign and then manage the complete lead conversion process to find  the prospects leads and create account. Complete\nautomated sales process that increase the pace of customer handling and quick delivery makes the customers happy helps to retain and gain new customers.\n\n\nUDX Pvt Ltd, - Business Development Manager\nProject Name: LAW Entrance Coaching\nEnvironment:    ~~~~~~~~~   Platform\nDescription: UDX is mainly in all LAW related coaching business. Provides different courses,\ncovers different exam, and Judges entrance coaching. Salesforce CRM control maximum business with different objects. Business deals with different study material printers, material suppliers,\nmarketing  channel  partners, students, colleges, schools, faculties, research  team, purchase\ndepartment and Franchise partners.\nResponsibilities:\n•   Identified  and  pursued  valuable  business  opportunities  to  generate  new  revenue  and\n\nimprove bottom line profit.\n•   Understanding the business requirements and detailed solution definition.\n•   Customization of the organization profile, creation of custom objects, custom fields, formula\nfields as per the requirements.\n•   Evaluates data entry, import processes, and insures proper data quality standards along with Apex data loader\n•   Works  closely  with  management  and  other  department  heads  to  accomplish  requested\ndeliverables using salesforce.com CRM application.\n•   Propose franchise development plan and create new franchises.\n•   Work closely with marketing and sales team for campaigns and events.\n\n\nVoltage Infra Pvt Ltd, - Project Manager\n•   E2E Project development: Planning, design, execution, monitoring, controlling and closure of a project.\n•   Complete erection and commissioning of Substation and EHV transmission line.\n•   Project Planning & develop outsourcing model for internal sub projects\n•   Erection & commissioning  of  different  devices  for  controlling, safety, switching,\ncommunicating such as transformer, breaker, Isolator, CT/PT, LA etc.\n•   Prepare and develop testing plan for complete project\n•   Prepare joint measurement sheet for billing with client and also do subcontractors billing\n•   Communicate with all the stakeholders: State Electricity Board, suppliers, Sub-contractors,\nlabors\n•   Handle right of way issues and permissions from different local/central Government bodies.\n\n\nSMS Infra Pvt Ltd, - Sub Divisional In charge\n•   Allocate the work and distribute the area for individual contractors\n•   Train resources and Supervise work of 28 sub-subcontractors\n•   Construction of overhead Distribution lines & Distribution Transformer, Underground cable\n•   Co-ordinate with local government bodies and Electricity board\n•   Look after measurement of contractor work for billing with quality check\n•   Organize team building activities & motivate team to finish the project before deadlines\n•   Awarded as fastest Project Completion Award 2010"
          }
        ]
      },
      "SkillsData": [
        {
          "Root": "Sovren",
          "Taxonomies": [
            {
              "Id": "10",
              "Name": "Information Technology",
              "PercentOfOverall": 56,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "199",
                  "SubTaxonomyName": "Project Management",
                  "PercentOfOverall": 51,
                  "PercentOfParent": 91,
                  "Skills": [
                    {
                      "Id": "005803",
                      "Name": "Project Development",
                      "FoundIn": [
                        {
                          "SectionType": "SKILLS"
                        },
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    },
                    {
                      "Id": "005812",
                      "Name": "Project Lifecycle",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    },
                    {
                      "Id": "022909",
                      "Name": "Project Manager",
                      "FoundIn": [
                        {
                          "SectionType": "PERSONAL INTERESTS AND ACCOMPLISHMENTS"
                        },
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-1"
                        },
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-3"
                        },
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 97
                      },
                      "LastUsed": {
                        "Value": "2020-12-01"
                      }
                    },
                    {
                      "Id": "005820",
                      "Name": "Project Planning",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "251",
                  "SubTaxonomyName": "Config Deploy Upgrade Migrate",
                  "PercentOfOverall": 1,
                  "PercentOfParent": 2,
                  "Skills": [
                    {
                      "Id": "022159",
                      "Name": "Change Management",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    },
                    {
                      "Id": "023631",
                      "Name": "Deployment",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    },
                    {
                      "Id": "020238",
                      "Name": "ITIL",
                      "FoundIn": [
                        {
                          "SectionType": "CERTIFICATIONS"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "556",
                  "SubTaxonomyName": "Privacy and Data Security",
                  "PercentOfOverall": 1,
                  "PercentOfParent": 2,
                  "Skills": [
                    {
                      "Id": "5551315",
                      "Name": "ISO",
                      "FoundIn": [
                        {
                          "SectionType": "CERTIFICATIONS"
                        }
                      ],
                      "ExistsInText": true
                    },
                    {
                      "Id": "5551260",
                      "Name": "ITIL",
                      "FoundIn": [
                        {
                          "SectionType": "CERTIFICATIONS"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "349",
                  "SubTaxonomyName": "Operations, Monitoring and Software Management",
                  "PercentOfOverall": 1,
                  "PercentOfParent": 1,
                  "Skills": [
                    {
                      "Id": "3490036",
                      "Name": "ITIL",
                      "FoundIn": [
                        {
                          "SectionType": "CERTIFICATIONS"
                        }
                      ],
                      "ExistsInText": true
                    },
                    {
                      "Id": "081178",
                      "Name": "SMS",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "550",
                  "SubTaxonomyName": "Cloud Computing",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 1,
                  "Skills": [
                    {
                      "Id": "5500380",
                      "Name": "Salesforce.Com",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "198",
                  "SubTaxonomyName": "Network",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 1,
                  "Skills": [
                    {
                      "Id": "1980041",
                      "Name": "Switching",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "347",
                  "SubTaxonomyName": "Telephony",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 1,
                  "Skills": [
                    {
                      "Id": "026854",
                      "Name": "APEX",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "200",
                  "SubTaxonomyName": "QA and QC",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 1,
                  "Skills": [
                    {
                      "Id": "015002",
                      "Name": "Data Quality",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "252",
                  "SubTaxonomyName": "Prebuilt Software",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 0,
                  "Skills": [
                    {
                      "Id": "022475",
                      "Name": "Billing",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "195",
                  "SubTaxonomyName": "ERP and CRM",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 0,
                  "Skills": [
                    {
                      "Id": "014101",
                      "Name": "CRM",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "20",
              "Name": "Sales",
              "PercentOfOverall": 18,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "105",
                  "SubTaxonomyName": "General",
                  "PercentOfOverall": 18,
                  "PercentOfParent": 100,
                  "Skills": [
                    {
                      "Id": "023757",
                      "Name": "Business Development",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-2"
                        },
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 42
                      },
                      "LastUsed": {
                        "Value": "2017-09-30"
                      }
                    },
                    {
                      "Id": "030830",
                      "Name": "Sales Team",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    },
                    {
                      "Id": "030881",
                      "Name": "Selling Products",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "14",
              "Name": "Marketing",
              "PercentOfOverall": 9,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "249",
                  "SubTaxonomyName": "General",
                  "PercentOfOverall": 9,
                  "PercentOfParent": 96,
                  "Skills": [
                    {
                      "Id": "021241",
                      "Name": "Marketing",
                      "FoundIn": [
                        {
                          "SectionType": "EDUCATION",
                          "Id": "DEG-1"
                        },
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2016-01-01"
                      }
                    },
                    {
                      "Id": "021246",
                      "Name": "Marketing Department",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "585",
                  "SubTaxonomyName": "Product",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 2,
                  "Skills": [
                    {
                      "Id": "1400308",
                      "Name": "Marketing Campaign",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "592",
                  "SubTaxonomyName": "Marketing Communications",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 2,
                  "Skills": [
                    {
                      "Id": "1400348",
                      "Name": "Marketing Campaign",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "5",
              "Name": "Engineering",
              "PercentOfOverall": 3,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "268",
                  "SubTaxonomyName": "RF",
                  "PercentOfOverall": 2,
                  "PercentOfParent": 66,
                  "Skills": [
                    {
                      "Id": "022904",
                      "Name": "Telecom",
                      "FoundIn": [
                        {
                          "SectionType": "EDUCATION",
                          "Id": "DEG-1"
                        }
                      ],
                      "ExistsInText": true,
                      "LastUsed": {
                        "Value": "2016-01-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "308",
                  "SubTaxonomyName": "Power Engineering",
                  "PercentOfOverall": 1,
                  "PercentOfParent": 32,
                  "Skills": [
                    {
                      "Id": "024955",
                      "Name": "Power System",
                      "FoundIn": [
                        {
                          "SectionType": "PERSONAL INTERESTS AND ACCOMPLISHMENTS"
                        }
                      ],
                      "ExistsInText": true
                    },
                    {
                      "Id": "080360",
                      "Name": "Substation",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    },
                    {
                      "Id": "022995",
                      "Name": "Transmission Line",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "144",
                  "SubTaxonomyName": "Computer Hardware",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 3,
                  "Skills": [
                    {
                      "Id": "080783",
                      "Name": "Substation",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "22",
              "Name": "Construction Non-Laborer",
              "PercentOfOverall": 2,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "389",
                  "SubTaxonomyName": "General Tasks and Equipment",
                  "PercentOfOverall": 1,
                  "PercentOfParent": 55,
                  "Skills": [
                    {
                      "Id": "023575",
                      "Name": "PRE-Construction",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "381",
                  "SubTaxonomyName": "Supervision",
                  "PercentOfOverall": 1,
                  "PercentOfParent": 45,
                  "Skills": [
                    {
                      "Id": "022283",
                      "Name": "Construction Management",
                      "FoundIn": [
                        {
                          "SectionType": "SKILLS"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                }
              ]
            },
            {
              "Id": "16",
              "Name": "Telecommunications",
              "PercentOfOverall": 1,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "317",
                  "SubTaxonomyName": "Standards, Protocols, Technologies",
                  "PercentOfOverall": 1,
                  "PercentOfParent": 98,
                  "Skills": [
                    {
                      "Id": "081157",
                      "Name": "SMS",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    },
                    {
                      "Id": "022903",
                      "Name": "Telecom",
                      "FoundIn": [
                        {
                          "SectionType": "EDUCATION",
                          "Id": "DEG-1"
                        }
                      ],
                      "ExistsInText": true,
                      "LastUsed": {
                        "Value": "2016-01-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "315",
                  "SubTaxonomyName": "Cabling and Related",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 2,
                  "Skills": [
                    {
                      "Id": "009856",
                      "Name": "Transmission Line",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "45",
              "Name": "Transmission & Distribution",
              "PercentOfOverall": 1,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "326",
                  "SubTaxonomyName": "Transmission",
                  "PercentOfOverall": 1,
                  "PercentOfParent": 68,
                  "Skills": [
                    {
                      "Id": "015513",
                      "Name": "Distribution Lines",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    },
                    {
                      "Id": "015903",
                      "Name": "EHV",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    },
                    {
                      "Id": "022360",
                      "Name": "Substation",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    },
                    {
                      "Id": "022994",
                      "Name": "Transmission Line",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "324",
                  "SubTaxonomyName": "Overhead",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 32,
                  "Skills": [
                    {
                      "Id": "004186",
                      "Name": "Overhead Distribution",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "90",
              "Name": "Personal Attributes",
              "PercentOfOverall": 1,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "528",
                  "SubTaxonomyName": "Attitude",
                  "PercentOfOverall": 1,
                  "PercentOfParent": 100,
                  "Skills": [
                    {
                      "Id": "007739",
                      "Name": "Self Motivated",
                      "ExistsInText": false
                    }
                  ]
                }
              ]
            },
            {
              "Id": "29",
              "Name": "Hardware Engineering",
              "PercentOfOverall": 1,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "713",
                  "SubTaxonomyName": "EMC / SI",
                  "PercentOfOverall": 1,
                  "PercentOfParent": 100,
                  "Skills": [
                    {
                      "Id": "5000006",
                      "Name": "EMC",
                      "FoundIn": [
                        {
                          "SectionType": "CERTIFICATIONS"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                }
              ]
            },
            {
              "Id": "1",
              "Name": "Administrative or Clerical",
              "PercentOfOverall": 1,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "109",
                  "SubTaxonomyName": "Document-centric",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 42,
                  "Skills": [
                    {
                      "Id": "014123",
                      "Name": "Data Entry",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "945",
                  "SubTaxonomyName": "Machines",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 42,
                  "Skills": [
                    {
                      "Id": "0054452",
                      "Name": "Printers",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "111",
                  "SubTaxonomyName": "Recordkeeping and Supplies",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 11,
                  "Skills": [
                    {
                      "Id": "012256",
                      "Name": "Buying",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "110",
                  "SubTaxonomyName": "Billing and Collections",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 5,
                  "Skills": [
                    {
                      "Id": "022474",
                      "Name": "Billing",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "7",
              "Name": "Finance",
              "PercentOfOverall": 1,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "709",
                  "SubTaxonomyName": "Global Security",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 36,
                  "Skills": [
                    {
                      "Id": "7000101",
                      "Name": "Vendor Management",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "708",
                  "SubTaxonomyName": "Procurement",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 36,
                  "Skills": [
                    {
                      "Id": "7000088",
                      "Name": "Vendor Management",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "246",
                  "SubTaxonomyName": "Treasury",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 27,
                  "Skills": [
                    {
                      "Id": "012194",
                      "Name": "Business Analysis",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                }
              ]
            },
            {
              "Id": "71",
              "Name": "Strategy and Planning",
              "PercentOfOverall": 1,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "876",
                  "SubTaxonomyName": "Workflow and Processes",
                  "PercentOfOverall": 1,
                  "PercentOfParent": 100,
                  "Skills": [
                    {
                      "Id": "024469",
                      "Name": "Business Analysis",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    },
                    {
                      "Id": "022626",
                      "Name": "Business Requirements",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "32",
              "Name": "Degreed Accounting",
              "PercentOfOverall": 1,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "962",
                  "SubTaxonomyName": "Reporting",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 56,
                  "Skills": [
                    {
                      "Id": "022891",
                      "Name": "Budget",
                      "FoundIn": [
                        {
                          "SectionType": "PERSONAL INTERESTS AND ACCOMPLISHMENTS"
                        },
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "942",
                  "SubTaxonomyName": "Auditing",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 44,
                  "Skills": [
                    {
                      "Id": "005584",
                      "Name": "Audit",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "9",
              "Name": "Human Resources",
              "PercentOfOverall": 1,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "579",
                  "SubTaxonomyName": "HR Management",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 50,
                  "Skills": [
                    {
                      "Id": "9000169",
                      "Name": "Change Management",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    },
                    {
                      "Id": "9000164",
                      "Name": "Coaching",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "581",
                  "SubTaxonomyName": "Organization Development",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 28,
                  "Skills": [
                    {
                      "Id": "9000213",
                      "Name": "Change Management",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "583",
                  "SubTaxonomyName": "Talent Sourcing",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 22,
                  "Skills": [
                    {
                      "Id": "9000267",
                      "Name": "Customer Relationship Management",
                      "ExistsInText": false,
                      "Variations": [
                        {
                          "Id": "9000268",
                          "Name": "CRM",
                          "FoundIn": [
                            {
                              "SectionType": "WORK HISTORY",
                              "Id": "POS-4"
                            }
                          ],
                          "ExistsInText": true,
                          "MonthsExperience": {
                            "Value": 24
                          },
                          "LastUsed": {
                            "Value": "2011-06-01"
                          }
                        }
                      ],
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      },
                      "ChildrenMonthsExperience": {
                        "Value": 24
                      },
                      "ChildrenLastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "34",
              "Name": "Business Operations and General Business",
              "PercentOfOverall": 1,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "436",
                  "SubTaxonomyName": "Management Activities or Functions",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 54,
                  "Skills": [
                    {
                      "Id": "012977",
                      "Name": "Change Management",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    },
                    {
                      "Id": "003875",
                      "Name": "Operations",
                      "FoundIn": [
                        {
                          "SectionType": "SKILLS"
                        },
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "437",
                  "SubTaxonomyName": "General Skills and Activities",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 46,
                  "Skills": [
                    {
                      "Id": "021737",
                      "Name": "Metrics",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "80",
              "Name": "General Management",
              "PercentOfOverall": 1,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "517",
                  "SubTaxonomyName": "People Oriented",
                  "PercentOfOverall": 1,
                  "PercentOfParent": 87,
                  "Skills": [
                    {
                      "Id": "021625",
                      "Name": "Mentor",
                      "FoundIn": [
                        {
                          "SectionType": "PERSONAL INTERESTS AND ACCOMPLISHMENTS"
                        }
                      ],
                      "ExistsInText": true
                    },
                    {
                      "Id": "009221",
                      "Name": "Team Building",
                      "FoundIn": [
                        {
                          "SectionType": "PERSONAL INTERESTS AND ACCOMPLISHMENTS"
                        },
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "519",
                  "SubTaxonomyName": "Management and Management Tasks",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 13,
                  "Skills": [
                    {
                      "Id": "005802",
                      "Name": "Project Development",
                      "FoundIn": [
                        {
                          "SectionType": "SKILLS"
                        },
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "97",
              "Name": "Supply Chain and Logistics",
              "PercentOfOverall": 1,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "459",
                  "SubTaxonomyName": "Inventory",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 56,
                  "Skills": [
                    {
                      "Id": "020086",
                      "Name": "Inventory",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                },
                {
                  "SubTaxonomyId": "458",
                  "SubTaxonomyName": "Purchasing",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 44,
                  "Skills": [
                    {
                      "Id": "023098",
                      "Name": "Buying",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    },
                    {
                      "Id": "010474",
                      "Name": "Vendor Management",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                }
              ]
            },
            {
              "Id": "92",
              "Name": "Knowledge and Learning Management",
              "PercentOfOverall": 1,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "903",
                  "SubTaxonomyName": "General Knowledge and Learning Management",
                  "PercentOfOverall": 1,
                  "PercentOfParent": 100,
                  "Skills": [
                    {
                      "Id": "200053",
                      "Name": "Coaching",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    },
                    {
                      "Id": "200052",
                      "Name": "Mentor",
                      "FoundIn": [
                        {
                          "SectionType": "PERSONAL INTERESTS AND ACCOMPLISHMENTS"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                }
              ]
            },
            {
              "Id": "31",
              "Name": "Written Communications",
              "PercentOfOverall": 0,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "429",
                  "SubTaxonomyName": "Specs and Documentation",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 100,
                  "Skills": [
                    {
                      "Id": "022620",
                      "Name": "Documentation",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "11",
              "Name": "General Non-Skilled Labor",
              "PercentOfOverall": 0,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "301",
                  "SubTaxonomyName": "Drivers",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 100,
                  "Skills": [
                    {
                      "Id": "020850",
                      "Name": "Loader",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "Id": "89",
              "Name": "Bookkeeping, Office Management",
              "PercentOfOverall": 0,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "533",
                  "SubTaxonomyName": "Bookeeping Tasks",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 100,
                  "Skills": [
                    {
                      "Id": "011553",
                      "Name": "Billing",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    },
                    {
                      "Id": "012120",
                      "Name": "Budget",
                      "FoundIn": [
                        {
                          "SectionType": "PERSONAL INTERESTS AND ACCOMPLISHMENTS"
                        },
                        {
                          "SectionType": "WORK HISTORY"
                        }
                      ],
                      "ExistsInText": true
                    }
                  ]
                }
              ]
            },
            {
              "Id": "26",
              "Name": "Power Engineering",
              "PercentOfOverall": 0,
              "SubTaxonomies": [
                {
                  "SubTaxonomyId": "925",
                  "SubTaxonomyName": "General Power Related",
                  "PercentOfOverall": 0,
                  "PercentOfParent": 100,
                  "Skills": [
                    {
                      "Id": "022359",
                      "Name": "Substation",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    },
                    {
                      "Id": "022993",
                      "Name": "Transmission Line",
                      "FoundIn": [
                        {
                          "SectionType": "WORK HISTORY",
                          "Id": "POS-4"
                        }
                      ],
                      "ExistsInText": true,
                      "MonthsExperience": {
                        "Value": 24
                      },
                      "LastUsed": {
                        "Value": "2011-06-01"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      "Certifications": [
        {
          "Name": "BCMS Implementation  ISO 22301:2012",
          "MatchedFromList": false,
          "IsVariation": false
        },
        {
          "Name": "Business Process Framework (eTOM)",
          "MatchedFromList": false,
          "IsVariation": false
        },
        {
          "Name": "Business Process Framework",
          "MatchedFromList": false,
          "IsVariation": true
        },
        {
          "Name": "EMC Academic  Associate - ISM",
          "MatchedFromList": false,
          "IsVariation": false
        },
        {
          "Name": "ITIL V3 Foundation",
          "MatchedFromList": false,
          "IsVariation": false
        },
        {
          "Name": "easy path for the",
          "MatchedFromList": false,
          "IsVariation": false
        },
        {
          "Name": "ITIL V3",
          "MatchedFromList": true,
          "IsVariation": true
        }
      ],
      "LanguageCompetencies": [
        {
          "Language": "English",
          "LanguageCode": "en",
          "FoundInContext": "[RESUME_LANGUAGE]"
        }
      ],
      "Achievements": [
        "Awarded as fastest Project Completion Award 2010",
        "Complete all the Projects well within the timeline",
        "Completed Hiwarwadi Project for Regen Powertech of of 52 Cr within 8 months well before",
        "Finished Pen subdivision and Matheran Projects on time and under budget",
        "Trained and mentor a team of 18 juniors",
        "Promoted to Project Manager with a year of employment",
        "Received numerous letters of recommendation and overall appreciation from customers",
        "Founder and Secretory of URSDAY social organization",
        "Complete Outbound leadership and Team Building camp",
        "Complete the adventurous camp at \"Palasful\" Chikhaldhara",
        "Organize& Attend Seminar on \"Power System and Protection, Personality Development\"",
        "Main organizer of Nagpur level student and teacher get together"
      ],
      "QualificationsSummary": "SKILLS\n\n.   Salesforce(SFDC)\n.   SFDC Business  Analyst\n.   Project Development\n\n.   Construction management\n.   Negotiation  expert\n.   Multi-site operations\n.   Project  planning",
      "Hobbies": "•   Meditation\n\n•   Social work\n\n•   Making sketches\n\n•   Bamboo and wax work\n\n•   Music\n•   Cricket",
      "ResumeMetadata": {
        "FoundSections": [
          {
            "FirstLineNumber": 8,
            "LastLineNumber": 19,
            "SectionType": "SKILLS",
            "HeaderTextFound": "SKILLS"
          },
          {
            "FirstLineNumber": 20,
            "LastLineNumber": 33,
            "SectionType": "EDUCATION",
            "HeaderTextFound": "EDUCATION"
          },
          {
            "FirstLineNumber": 34,
            "LastLineNumber": 45,
            "SectionType": "CERTIFICATIONS",
            "HeaderTextFound": "CERTIFICATIONS"
          },
          {
            "FirstLineNumber": 46,
            "LastLineNumber": 57,
            "SectionType": "HOBBIES",
            "HeaderTextFound": "HOBBIES"
          },
          {
            "FirstLineNumber": 58,
            "LastLineNumber": 218,
            "SectionType": "WORK HISTORY",
            "HeaderTextFound": "PROFESSIONAL\tSUMMARY"
          },
          {
            "FirstLineNumber": 219,
            "LastLineNumber": 234,
            "SectionType": "PERSONAL INTERESTS AND ACCOMPLISHMENTS",
            "HeaderTextFound": "Accomplishments"
          }
        ],
        "ResumeQuality": [
          {
            "Level": "Fatal Problems Found",
            "Findings": [
              {
                "QualityCode": "433",
                "Message": "We detected that this document contained at least some data that was laid out as columns or tables. We rearranged that data to make it more usable. NEVER use columns or tables in a resume."
              }
            ]
          },
          {
            "Level": "Major Issues Found",
            "Findings": [
              {
                "QualityCode": "300",
                "Message": "You should not use the PDF format for your resume. Due to inherent limitations with text extraction from PDFs, you are less likely to get a job when using a PDF resume."
              },
              {
                "QualityCode": "302",
                "Message": "A first and last name was not found in the contact information. A resume should always include the candidate's first and last name."
              }
            ]
          },
          {
            "Level": "Data Missing",
            "Findings": [
              {
                "QualityCode": "213",
                "Message": "A street level address was not found in the contact information. A full contact address should always be included in a resume as it allows for location based searches."
              }
            ]
          },
          {
            "Level": "Suggested Improvements",
            "Findings": [
              {
                "QualityCode": "112",
                "Message": "The following section was identified as a skills section type: 'SKILLS'. Skills should not be in a separate section, but instead, each skill should be included in the descriptions of work history or education. THIS IS INCREDIBLY IMPORTANT FOR AI MATCHING ALGORITHMS"
              }
            ]
          }
        ],
        "PlainText": "Tikesh\tBodele\n\n@    ~~~~~~~~~~~~~~~~~  \nNagpur, MH 440022\n\n   ~~~~~  \n•\n\n\nSKILLS\n\n.   Salesforce(SFDC)\n.   SFDC Business  Analyst\n.   Project Development\n\n.   Construction management\n.   Negotiation  expert\n.   Multi-site operations\n.   Project  planning\n\n\nEDUCATION\n\n\n•   Symbiosis Institute of Telecom\n\nManagement, Pune MH. 2016\nMBA: Marketing\n\n•   Yashwantrao  Chavan College of\nEngineering, Nagpur MH. 2009\n\nBE: Electrical Engg\n\n\nCERTIFICATIONS\n\nITIL V3 Foundation,\n\nBCMS Implementation  ISO 22301:2012\n\nBusiness Process Framework (eTOM)\neasy path for the\nFundamentals\nEMC Academic  Associate - ISM\n\n\nHOBBIES\n\n•   Meditation\n\n•   Social work\n\n•   Making sketches\n\n•   Bamboo and wax work\n\n•   Music\n•   Cricket\nPROFESSIONAL\tSUMMARY\n\n•   Project Manager with total 9.9 years of experience in which 3 years on SFDC\n•   Experience in E2E Project Planning and execution, business analysis, Customer\nmanagement, Implementation and support experience with    ~~~~~~~~~  .\n•   Experience in Deployment of change management in different organisation.\n\n•   Good hands on vendor management, handle multiple vendors same time.\n•   Highly  skilled  in  all  project  phases,  pre-construction  or  development,  E2E\nproject development. Successfully managed more than 9 diverse projects.\n•   Proactive leader skills in managing the project team to provide value to the\nclient by delivering quality projects on time and within budget.\n\nWORK\tHISTORY\n\n•   AJ Enterprise - Project Manager\t 10/2017- 12/2020\n\nSt Townsville QLD 4810 Australia\nUDX Pvt Ltd - Business Development Manager\t04/2016 - 09/2017\nBangalore, Karnataka.\n\n•   Voltage Infra Pvt Ltd - Project Manager\t  06/2011 - 05/2014\nPune, Maharashtra.\n•   SMS Infra Pvt Ltd - Sub Divisional In charge\t06/2009 - 06/2011\n\nPen, Maharashtra.\n\n\nAJ Enterprise - Project Manager\nResponsibilities:\n•   Understand the customer's problems, perform different analysis methods to analyze their\nbusinesses from business as well as functional side.\n•   Analyze existing technology in their processes and design new desired solution as per current\nmarketing conditions.\n•   Find out the risk to mitigate its impact and identify opportunity. Check on feasibility and\nbusiness impacts of various solution options.\n•   Create project backlog and then break it into user stories with acceptance criteria.\n\n•   Define a project vision and sets of project strategy. Outlines what the project success looks\n\nlike.\n•   Work on iteration period for each sprint and decide complete timeline for the project.\n\n•   Create different traceability metrics to trace progress of each sprint. And track complete\nproject lifecycle.\n•   Managed project elements for multiple initiatives from initial planning to project roll outs.\n•   Gather  a  performed  knowledge  of  the  project,  market  and  customer  to  prepare  project\ndocuments.\n•   Identify the stakeholders and work more closely with external stakeholders.\n•   Create a project roadmap that outlines the vision, direction and priorities.\n•   Design Training program of salesforce for the Sales and Marketing Teams on customer end\n•   Monitored team's adoption rates and responded as needed. Providing them with training\nsessions, communication and documentation as needed.\n\nProject accomplished:\n\nProject # 1\nProject Name: Dream Australia\nEnvironment:    ~~~~~~~~~   Platform\nClient: GTRS\nDescription: GTRS is parent company of AJ Enterprise mainly works as a job consultancy,\n\nprovides jobs and internship programs in the industry with their domain specialization makes\n\njob seekers. Students, fresher, or working professional those who want to\nmigrate in Australia GTRS provides opportunities. They have CRM function for business control.\nCompany  has to deals with tasks like Getting customers, different country operations, channel\npartners,  business  partners,  employees,  marketing  and  sales  teams,  Marketing  Plans  like\ncampaigns,  events  on  daily  basis.  Channelize  complete  path  from  lead  generation  to  lead\nconversion and putting those leads into the right industry.\n\n\nProject # 2\n\nProject Name: Arise Solar CRM\n\nClient: Arise Solar\nEnvironment:    ~~~~~~~~~   Platform\n\nDescription: Arise  Solar is mainly into the Solar appliances business, where they sale the\nsolar products to the customer based the requirements. Arise Solar CRM solution is for sales & marketing aspects to complete the selling and buying Cycle. The global CRM process developed\nin Arise  Solar starts with the marketing department where they create campaigns to target\ndifferent customers, generate leads or just to create new leads to be managed and qualified by\nthe  sales  team.  An  Opportunity  is  usually  used  to  track  a  \"Deal\"  from  its  early  stages  to\ncompletion, it hold various information like Products category, total sale, stock statement, new\narrivals, Delivery pending etc.\n\nProject # 3\nProject Name: Clare CRM\nClient: Clare Hospitals, Australia\nEnvironment:    ~~~~~~~~~  \nDescription: Scope  was  to  create  Hospital  Management,  Scheduler,  Billing,  Inventory  and\nReporting application that resides on the    ~~~~~~~~~   platform. The patient module provides\nfunctionality to create and edit patient's details. Assign doctors, nurses, rooms for procedures. It\nalso provides tracking features like Audit Trails, Communication logs, Alerts and reports. The\nscheduler module provides the functionality to create and track appointments for the patients\nwith doctors for consult, surgery, etc. Doctors could specify there preferred working hours and\nalso the  preferred  procedures that the  will  do  at  those  times.  There  is  also  facility to  view\nunattended appointments.\n\nProject # 4\nProject Name: Autobarn CRM\nClient: Autobarn, Australia\nEnvironment:    ~~~~~~~~~  \nDescription: Complete automobile solution for all types of vehicle. Whatever your automotive\ndream is, Autobarn can get you there. With over 150 stores across Australia, Autobarn can help\nyou get precisely what you want. For them, it's not just about selling products. Their staff happily\nassists and inquires to know your needs like what kind of car you have or want to purchase.\nAutobarn CRM process starts with channelizing their marketing campaign and then manage the\ncomplete lead conversion process to find  the prospects leads and create account. Complete\nautomated sales process that increase the pace of customer handling and quick delivery makes\nthe customers happy helps to retain and gain new customers.\n\n\nUDX Pvt Ltd, - Business Development Manager\nProject Name: LAW Entrance Coaching\nEnvironment:    ~~~~~~~~~   Platform\nDescription: UDX is mainly in all LAW related coaching business. Provides different courses,\ncovers different exam, and Judges entrance coaching. Salesforce CRM control maximum business\nwith different objects. Business deals with different study material printers, material suppliers,\nmarketing  channel  partners,  students,  colleges,  schools,  faculties,  research  team,  purchase\ndepartment and Franchise partners.\nResponsibilities:\n•   Identified  and  pursued  valuable  business  opportunities  to  generate  new  revenue  and\n\nimprove bottom line profit.\n•   Understanding the business requirements and detailed solution definition.\n•   Customization of the organization profile, creation of custom objects, custom fields, formula\nfields as per the requirements.\n•   Evaluates data entry, import processes, and insures proper data quality standards along with\nApex data loader\n•   Works  closely  with  management  and  other  department  heads  to  accomplish  requested\ndeliverables using    ~~~~~~~~~   CRM application.\n•   Propose franchise development plan and create new franchises.\n•   Work closely with marketing and sales team for campaigns and events.\n\n\nVoltage Infra Pvt Ltd, - Project Manager\n•   E2E Project development: Planning, design, execution, monitoring, controlling and closure of\na project.\n•   Complete erection and commissioning of Substation and EHV transmission line.\n•   Project Planning & develop outsourcing model for internal sub projects\n•   Erection & commissioning  of  different  devices  for  controlling,  safety,  switching,\ncommunicating such as transformer, breaker, Isolator, CT/PT, LA etc.\n•   Prepare and develop testing plan for complete project\n•   Prepare joint measurement sheet for billing with client and also do subcontractors billing\n•   Communicate with all the stakeholders: State Electricity Board, suppliers, Sub-contractors,\nlabors\n•   Handle right of way issues and permissions from different local/central Government bodies.\n\n\nSMS Infra Pvt Ltd, - Sub Divisional In charge\n•   Allocate the work and distribute the area for individual contractors\n•   Train resources and Supervise work of 28 sub-subcontractors\n•   Construction of overhead Distribution lines & Distribution Transformer, Underground cable\n•   Co-ordinate with local government bodies and Electricity board\n•   Look after measurement of contractor work for billing with quality check\n•   Organize team building activities & motivate team to finish the project before deadlines\n•   Awarded as fastest Project Completion Award 2010\n\n\nAccomplishments\n•   Complete all the Projects well within the timeline.\n•   Completed Hiwarwadi Project for Regen Powertech of of 52 Cr within 8 months well before\ndeadline.\n•   Finished Pen subdivision and Matheran Projects on time and under budget.\n•   Trained and mentor a team of 18 juniors.\n•   Promoted to Project Manager with a year of employment.\n•   Received numerous letters of recommendation and overall appreciation from customers.\n\n\nAdditional Information\n•   Founder and Secretory of URSDAY social organization\n•   Complete Outbound leadership and Team Building camp\n•   Complete the adventurous camp at \"Palasful\" Chikhaldhara\n•   Organize& Attend Seminar on \"Power System and Protection, Personality Development\"\n•   Main organizer of Nagpur level student and teacher get together",
        "DocumentLanguage": "en",
        "DocumentCulture": "en-IN",
        "ParserSettings": "Coverage.MilitaryHistoryAndSecurityCredentials = True; Coverage.PatentsPublicationsAndSpeakingEvents = True; Coverage.PersonalAttributes = True; Coverage.Training = True; Culture.CountryCodeForUnitedKingdomIsUK = True; Culture.DefaultCountryCode = IN; Culture.DefaultCultureIsIndia = True; Culture.Language = English; Culture.PreferEnglishVersionIfTwoLanguagesInDocument = False; Data.UserDefinedParsing = False; OutputFormat.AssumeCompanyNameFromPrecedingJob = False; OutputFormat.ContactMethod.PackStyle = Split; OutputFormat.DateOutputStyle = ExplicitlyKnownDateInfoOnly; OutputFormat.NestJobsBasedOnDateRanges = True; OutputFormat.NormalizeRegions = False; OutputFormat.SimpleCustomLinkedIn = False; OutputFormat.SkillsStyle = Default; OutputFormat.StripParsedDataFromPositionHistoryDescription = True; OutputFormat.TelcomNumber.Style = Raw; OutputFormat.XmlFormat = HrXmlResume25",
        "DocumentLastModified": "2021-11-03",
        "SovrenSignature": [
          "S7ICAAAAAAA="
        ]
      }
    },
    "ConversionMetadata": {
      "DetectedType": "Pdf",
      "SuggestedFileExtension": "pdf",
      "OutputValidityCode": "ovIsProbablyValid",
      "ElapsedMilliseconds": 1171,
      "DocumentHash": "F6DF22454FA0421FCB1691B92AF563AA"
    }
  }
}




}
