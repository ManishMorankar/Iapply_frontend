
var mapData;
var settings = {
    "url": "https://iapplyapp.azurewebsites.net/API/api/GoForJobs/GoForJobsCount",
    "method": "GET",
    "timeout": 0,
  };

  $.ajax(settings).done(function (response) {
      mapData = response.result.map
    console.log(response.result.map);
  });

$(function () {
            $(".mapcontainer").mapael({
                map: {
                    name: "world_countries",
                    defaultArea: {
                        attrs: {
							 fill: "#b6c8ff",
                            stroke: "#fff",
                            "stroke-width": 0.5
                        },
                    attrsHover: {
                        fill: "#FFF",
                    },
                    }
                },
                areas:mapData
                // areas: {
                //     "AF": {
                //         "value": "35320445",
                //         "attrs": {
                //             "href": "#"
                //         },
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Afghanistan<\/span><br \/><span>Jobs Applied <br\><b> 35320445</b><\/span>"
                //         }
                //     },
                //     "ZA": {
                //         "value": "50586757",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">South Africa<\/span><br \/><span>Jobs Applied <br\><b> 50586757</b><\/span>"
                //         }
                //     },
                //     "AL": {
                //         "value": "3215988",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Albania<\/span><br \/><span>Jobs Applied <br\><b> 3215988</b><\/span>"
                //         }
                //     },
                //     "DZ": {
                //         "value": "35980193",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Algeria<\/span><br \/><span>Jobs Applied <br\><b> 35980193</b><\/span>"
                //         }
                //     },
                //     "DE": {
                //         "value": "81726000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Germany<\/span><br \/><span>Jobs Applied <br\><b> 81726000</b><\/span>"
                //         }
                //     },
                //     "AD": {
                //         "value": "86165",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Andorra<\/span><br \/><span>Jobs Applied <br\><b> 86165</b><\/span>"
                //         }
                //     },
                //     "AO": {
                //         "value": "19618432",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Angola<\/span><br \/><span>Jobs Applied <br\><b> 19618432</b><\/span>"
                //         }
                //     },
                //     "AG": {
                //         "value": "89612",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Antigua And Barbuda<\/span><br \/><span>Jobs Applied <br\><b> 89612</b><\/span>"
                //         }
                //     },
                //     "SA": {
                //         "value": "28082541",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Saudi Arabia<\/span><br \/><span>Jobs Applied <br\><b> 28082541</b><\/span>"
                //         }
                //     },
                //     "AR": {
                //         "value": "40764561",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Argentina<\/span><br \/><span>Jobs Applied <br\><b> 40764561</b><\/span>"
                //         }
                //     },
                //     "AM": {
                //         "value": "3100236",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Armenia<\/span><br \/><span>Jobs Applied <br\><b> 3100236</b><\/span>"
                //         }
                //     },
                //     "AU": {
                //         "value": "22620600",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Australia<\/span><br \/><span>Jobs Applied <br\><b> 22620600</b><\/span>"
                //         }
                //     },
                //     "AT": {
                //         "value": "8419000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Austria<\/span><br \/><span>Jobs Applied <br\><b> 8419000</b><\/span>"
                //         }
                //     },
                //     "AZ": {
                //         "value": "9168000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Azerbaijan<\/span><br \/><span>Jobs Applied <br\><b> 9168000</b><\/span>"
                //         }
                //     },
                //     "BS": {
                //         "value": "347176",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Bahamas<\/span><br \/><span>Jobs Applied <br\><b> 347176</b><\/span>"
                //         }
                //     },
                //     "BH": {
                //         "value": "1323535",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Bahrain<\/span><br \/><span>Jobs Applied <br\><b> 1323535</b><\/span>"
                //         }
                //     },
                //     "BD": {
                //         "value": "150493658",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Bangladesh<\/span><br \/><span>Jobs Applied <br\><b> 150493658</b><\/span>"
                //         }
                //     },
                //     "BB": {
                //         "value": "273925",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Barbados<\/span><br \/><span>Jobs Applied <br\><b> 273925</b><\/span>"
                //         }
                //     },
                //     "BE": {
                //         "value": "11008000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Belgium<\/span><br \/><span>Jobs Applied <br\><b> 11008000</b><\/span>"
                //         }
                //     },
                //     "BZ": {
                //         "value": "356600",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Belize<\/span><br \/><span>Jobs Applied <br\><b> 356600</b><\/span>"
                //         }
                //     },
                //     "BJ": {
                //         "value": "9099922",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Benin<\/span><br \/><span>Jobs Applied <br\><b> 9099922</b><\/span>"
                //         }
                //     },
                //     "BT": {
                //         "value": "738267",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Bhutan<\/span><br \/><span>Jobs Applied <br\><b> 738267</b><\/span>"
                //         }
                //     },
                //     "BY": {
                //         "value": "9473000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Belarus<\/span><br \/><span>Jobs Applied <br\><b> 9473000</b><\/span>"
                //         }
                //     },
                //     "MM": {
                //         "value": "48336763",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Myanmar<\/span><br \/><span>Jobs Applied <br\><b> 48336763</b><\/span>"
                //         }
                //     },
                //     "BO": {
                //         "value": "10088108",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Bolivia, Plurinational State Of<\/span><br \/><span>Jobs Applied <br\><b> 10088108</b><\/span>"
                //         }
                //     },
                //     "BA": {
                //         "value": "3752228",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Bosnia And Herzegovina<\/span><br \/><span>Jobs Applied <br\><b> 3752228</b><\/span>"
                //         }
                //     },
                //     "BW": {
                //         "value": "2030738",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Botswana<\/span><br \/><span>Jobs Applied <br\><b> 2030738</b><\/span>"
                //         }
                //     },
                //     "BR": {
                //         "value": "196655014",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Brazil<\/span><br \/><span>Jobs Applied <br\><b> 196655014</b><\/span>"
                //         }
                //     },
                //     "BN": {
                //         "value": "405938",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Brunei Darussalam<\/span><br \/><span>Jobs Applied <br\><b> 405938</b><\/span>"
                //         }
                //     },
                //     "BG": {
                //         "value": "7476000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Bulgaria<\/span><br \/><span>Jobs Applied <br\><b> 7476000</b><\/span>"
                //         }
                //     },
                //     "BF": {
                //         "value": "16967845",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Burkina Faso<\/span><br \/><span>Jobs Applied <br\><b> 16967845</b><\/span>"
                //         }
                //     },
                //     "BI": {
                //         "value": "8575172",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Burundi<\/span><br \/><span>Jobs Applied <br\><b> 8575172</b><\/span>"
                //         }
                //     },
                //     "KH": {
                //         "value": "14305183",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Cambodia<\/span><br \/><span>Jobs Applied <br\><b> 14305183</b><\/span>"
                //         }
                //     },
                //     "CM": {
                //         "value": "20030362",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Cameroon<\/span><br \/><span>Jobs Applied <br\><b> 20030362</b><\/span>"
                //         }
                //     },
                //     "CA": {
                //         "value": "34482779",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Canada<\/span><br \/><span>Jobs Applied <br\><b> 34482779</b><\/span>"
                //         }
                //     },
                //     "CV": {
                //         "value": "500585",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Cape Verde<\/span><br \/><span>Jobs Applied <br\><b> 500585</b><\/span>"
                //         }
                //     },
                //     "CF": {
                //         "value": "4486837",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Central African Republic<\/span><br \/><span>Jobs Applied <br\><b> 4486837</b><\/span>"
                //         }
                //     },
                //     "CL": {
                //         "value": "17269525",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Chile<\/span><br \/><span>Jobs Applied <br\><b>17269525</b><\/span>"
                //         }
                //     },
                //     "CN": {
                //         "value": "1344130000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">China<\/span><br \/><span>Jobs Applied <br\><b> 1344130000</b><\/span>"
                //         }
                //     },
                //     "CY": {
                //         "value": "1116564",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Cyprus<\/span><br \/><span>Jobs Applied <br\><b> 1116564</b><\/span>"
                //         }
                //     },
                //     "CO": {
                //         "value": "46927125",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Colombia<\/span><br \/><span>Jobs Applied <br\><b> 46927125</b><\/span>"
                //         }
                //     },
                //     "KM": {
                //         "value": "753943",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Comoros<\/span><br \/><span>Jobs Applied <br\><b> 753943</b><\/span>"
                //         }
                //     },
                //     "CG": {
                //         "value": "4139748",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Congo<\/span><br \/><span>Jobs Applied <br\><b> 4139748</b><\/span>"
                //         }
                //     },
                //     "CD": {
                //         "value": "67757577",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Congo, The Democratic Republic Of The<\/span><br \/><span>Jobs Applied <br\><b> 67757577</b><\/span>"
                //         }
                //     },
                //     "KP": {
                //         "value": "24451285",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Korea, Democratic People's Republic Of<\/span><br \/><span>Jobs Applied <br\><b> 24451285</b><\/span>"
                //         }
                //     },
                //     "KR": {
                //         "value": "49779000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Korea, Republic Of<\/span><br \/><span>Jobs Applied <br\><b> 49779000</b><\/span>"
                //         }
                //     },
                //     "CR": {
                //         "value": "4726575",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Costa Rica<\/span><br \/><span>Jobs Applied <br\><b> 4726575</b><\/span>"
                //         }
                //     },
                //     "CI": {
                //         "value": "20152894",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">C\u00d4te D'ivoire<\/span><br \/><span>Jobs Applied <br\><b> 20152894</b><\/span>"
                //         }
                //     },
                //     "HR": {
                //         "value": "4407000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Croatia<\/span><br \/><span>Jobs Applied <br\><b> 4407000</b><\/span>"
                //         }
                //     },
                //     "CU": {
                //         "value": "11253665",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Cuba<\/span><br \/><span>Jobs Applied <br\><b> 11253665</b><\/span>"
                //         }
                //     },
                //     "DK": {
                //         "value": "5574000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Denmark<\/span><br \/><span>Jobs Applied <br\><b> 5574000</b><\/span>"
                //         }
                //     },
                //     "DJ": {
                //         "value": "905564",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Djibouti<\/span><br \/><span>Jobs Applied <br\><b> 905564</b><\/span>"
                //         }
                //     },
                //     "DM": {
                //         "value": "67675",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Dominica<\/span><br \/><span>Jobs Applied <br\><b> 67675</b><\/span>"
                //         }
                //     },
                //     "EG": {
                //         "value": "82536770",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Egypt<\/span><br \/><span>Jobs Applied <br\><b> 82536770</b><\/span>"
                //         }
                //     },
                //     "AE": {
                //         "value": "7890924",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">United Arab Emirates<\/span><br \/><span>Jobs Applied <br\><b> 7890924</b><\/span>"
                //         }
                //     },
                //     "EC": {
                //         "value": "14666055",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Ecuador<\/span><br \/><span>Jobs Applied <br\><b> 14666055</b><\/span>"
                //         }
                //     },
                //     "ER": {
                //         "value": "5415280",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Eritrea<\/span><br \/><span>Jobs Applied <br\><b> 5415280</b><\/span>"
                //         }
                //     },
                //     "ES": {
                //         "value": "46235000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Spain<\/span><br \/><span>Jobs Applied <br\><b> 46235000</b><\/span>"
                //         }
                //     },
                //     "EE": {
                //         "value": "1340000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Estonia<\/span><br \/><span>Jobs Applied <br\><b> 1340000</b><\/span>"
                //         }
                //     },
                //     "US": {
                //         "value": "311591917",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">United States<\/span><br \/><span>Jobs Applied <br\><b> 311591917</b><\/span>"
                //         }
                //     },
                //     "ET": {
                //         "value": "84734262",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Ethiopia<\/span><br \/><span>Jobs Applied <br\><b> 84734262</b><\/span>"
                //         }
                //     },
                //     "FJ": {
                //         "value": "868406",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Fiji<\/span><br \/><span>Jobs Applied <br\><b> 868406</b><\/span>"
                //         }
                //     },
                //     "FI": {
                //         "value": "5387000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Finland<\/span><br \/><span>Jobs Applied <br\><b> 5387000</b><\/span>"
                //         }
                //     },
                //     "FR": {
                //         "value": "65436552",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">France<\/span><br \/><span>Jobs Applied <br\><b> 65436552</b><\/span>"
                //         }
                //     },
                //     "GA": {
                //         "value": "1534262",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Gabon<\/span><br \/><span>Jobs Applied <br\><b> 1534262</b><\/span>"
                //         }
                //     },
                //     "GM": {
                //         "value": "1776103",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Gambia<\/span><br \/><span>Jobs Applied <br\><b> 1776103</b><\/span>"
                //         }
                //     },
                //     "GE": {
                //         "value": "4486000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Georgia<\/span><br \/><span>Jobs Applied <br\><b> 4486000</b><\/span>"
                //         }
                //     },
                //     "GH": {
                //         "value": "24965816",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Ghana<\/span><br \/><span>Jobs Applied <br\><b> 24965816</b><\/span>"
                //         }
                //     },
                //     "GR": {
                //         "value": "11304000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Greece<\/span><br \/><span>Jobs Applied <br\><b> 11304000</b><\/span>"
                //         }
                //     },
                //     "GD": {
                //         "value": "104890",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Grenada<\/span><br \/><span>Jobs Applied <br\><b> 104890</b><\/span>"
                //         }
                //     },
                //     "GT": {
                //         "value": "14757316",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Guatemala<\/span><br \/><span>Jobs Applied <br\><b> 14757316</b><\/span>"
                //         }
                //     },
                //     "GN": {
                //         "value": "10221808",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Guinea<\/span><br \/><span>Jobs Applied <br\><b> 10221808</b><\/span>"
                //         }
                //     },
                //     "GQ": {
                //         "value": "720213",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Equatorial Guinea<\/span><br \/><span>Jobs Applied <br\><b> 720213</b><\/span>"
                //         }
                //     },
                //     "GW": {
                //         "value": "1547061",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Guinea-bissau<\/span><br \/><span>Jobs Applied <br\><b> 1547061</b><\/span>"
                //         }
                //     },
                //     "GY": {
                //         "value": "756040",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Guyana<\/span><br \/><span>Jobs Applied <br\><b> 756040</b><\/span>"
                //         }
                //     },
                //     "HT": {
                //         "value": "10123787",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Haiti<\/span><br \/><span>Jobs Applied <br\><b> 10123787</b><\/span>"
                //         }
                //     },
                //     "HN": {
                //         "value": "7754687",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Honduras<\/span><br \/><span>Jobs Applied <br\><b> 7754687</b><\/span>"
                //         }
                //     },
                //     "HU": {
                //         "value": "9971000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Hungary<\/span><br \/><span>Jobs Applied <br\><b> 9971000</b><\/span>"
                //         }
                //     },
                //     "JM": {
                //         "value": "2709300",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Jamaica<\/span><br \/><span>Jobs Applied <br\><b> 2709300</b><\/span>"
                //         }
                //     },
                //     "JP": {
                //         "value": "127817277",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Japan<\/span><br \/><span>Jobs Applied <br\><b> 127817277</b><\/span>"
                //         }
                //     },
                //     "MH": {
                //         "value": "54816",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Marshall Islands<\/span><br \/><span>Jobs Applied <br\><b> 54816</b><\/span>"
                //         }
                //     },
                //     "PW": {
                //         "value": "20609",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Palau<\/span><br \/><span>Jobs Applied <br\><b> 20609</b><\/span>"
                //         }
                //     },
                //     "SB": {
                //         "value": "552267",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Solomon Islands<\/span><br \/><span>Jobs Applied <br\><b> 552267</b><\/span>"
                //         }
                //     },
                //     "IN": {
                //         "value": "1241491960",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">India<\/span><br \/><span>Jobs Applied <br\><b> 1241491960</b><\/span>"
                //         }
                //     },
                //     "ID": {
                //         "value": "242325638",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Indonesia<\/span><br \/><span>Jobs Applied <br\><b> 242325638</b><\/span>"
                //         }
                //     },
                //     "JO": {
                //         "value": "6181000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Jordan<\/span><br \/><span>Jobs Applied <br\><b> 6181000</b><\/span>"
                //         }
                //     },
                //     "IR": {
                //         "value": "74798599",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Iran, Islamic Republic Of<\/span><br \/><span>Jobs Applied <br\><b> 74798599</b><\/span>"
                //         }
                //     },
                //     "IQ": {
                //         "value": "32961959",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Iraq<\/span><br \/><span>Jobs Applied <br\><b> 32961959</b><\/span>"
                //         }
                //     },
                //     "IE": {
                //         "value": "4487000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Ireland<\/span><br \/><span>Jobs Applied <br\><b> 4487000</b><\/span>"
                //         }
                //     },
                //     "IS": {
                //         "value": "319000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Iceland<\/span><br \/><span>Jobs Applied <br\><b> 319000</b><\/span>"
                //         }
                //     },
                //     "IL": {
                //         "value": "7765700",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Israel<\/span><br \/><span>Jobs Applied <br\><b> 7765700</b><\/span>"
                //         }
                //     },
                //     "IT": {
                //         "value": "60770000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Italy<\/span><br \/><span>Jobs Applied <br\><b> 60770000</b><\/span>"
                //         }
                //     },
                //     "KZ": {
                //         "value": "16558459",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Kazakhstan<\/span><br \/><span>Jobs Applied <br\><b> 16558459</b><\/span>"
                //         }
                //     },
                //     "KE": {
                //         "value": "41609728",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Kenya<\/span><br \/><span>Jobs Applied <br\><b> 41609728</b><\/span>"
                //         }
                //     },
                //     "KG": {
                //         "value": "5507000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Kyrgyzstan<\/span><br \/><span>Jobs Applied <br\><b> 5507000</b><\/span>"
                //         }
                //     },
                //     "KI": {
                //         "value": "101093",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Kiribati<\/span><br \/><span>Jobs Applied <br\><b> 101093</b><\/span>"
                //         }
                //     },
                //     "KW": {
                //         "value": "2818042",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Kuwait<\/span><br \/><span>Jobs Applied <br\><b> 2818042</b><\/span>"
                //         }
                //     },
                //     "LA": {
                //         "value": "6288037",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Lao People's Democratic Republic<\/span><br \/><span>Jobs Applied <br\><b> 6288037</b><\/span>"
                //         }
                //     },
                //     "LS": {
                //         "value": "2193843",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Lesotho<\/span><br \/><span>Jobs Applied <br\><b> 2193843</b><\/span>"
                //         }
                //     },
                //     "LV": {
                //         "value": "2220000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Latvia<\/span><br \/><span>Jobs Applied <br\><b> 2220000</b><\/span>"
                //         }
                //     },
                //     "LB": {
                //         "value": "4259405",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Lebanon<\/span><br \/><span>Jobs Applied <br\><b> 4259405</b><\/span>"
                //         }
                //     },
                //     "LR": {
                //         "value": "4128572",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Liberia<\/span><br \/><span>Jobs Applied <br\><b> 4128572</b><\/span>"
                //         }
                //     },
                //     "LY": {
                //         "value": "6422772",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Libya<\/span><br \/><span>Jobs Applied <br\><b> 6422772</b><\/span>"
                //         }
                //     },
                //     "LI": {
                //         "value": "36304",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Liechtenstein<\/span><br \/><span>Jobs Applied <br\><b> 36304</b><\/span>"
                //         }
                //     },
                //     "LT": {
                //         "value": "3203000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Lithuania<\/span><br \/><span>Jobs Applied <br\><b> 3203000</b><\/span>"
                //         }
                //     },
                //     "LU": {
                //         "value": "517000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Luxembourg<\/span><br \/><span>Jobs Applied <br\><b> 517000</b><\/span>"
                //         }
                //     },
                //     "MK": {
                //         "value": "2063893",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Macedonia, The Former Yugoslav Republic Of<\/span><br \/><span>Jobs Applied <br\><b> 2063893</b><\/span>"
                //         }
                //     },
                //     "MG": {
                //         "value": "21315135",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Madagascar<\/span><br \/><span>Jobs Applied <br\><b> 21315135</b><\/span>"
                //         }
                //     },
                //     "MY": {
                //         "value": "28859154",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Malaysia<\/span><br \/><span>Jobs Applied <br\><b> 28859154</b><\/span>"
                //         }
                //     },
                //     "MW": {
                //         "value": "15380888",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Malawi<\/span><br \/><span>Jobs Applied <br\><b> 15380888</b><\/span>"
                //         }
                //     },
                //     "MV": {
                //         "value": "320081",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Maldives<\/span><br \/><span>Jobs Applied <br\><b> 320081</b><\/span>"
                //         }
                //     },
                //     "ML": {
                //         "value": "15839538",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Mali<\/span><br \/><span>Jobs Applied <br\><b> 15839538</b><\/span>"
                //         }
                //     },
                //     "MT": {
                //         "value": "419000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Malta<\/span><br \/><span>Jobs Applied <br\><b> 419000</b><\/span>"
                //         }
                //     },
                //     "MA": {
                //         "value": "32272974",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Morocco<\/span><br \/><span>Jobs Applied <br\><b> 32272974</b><\/span>"
                //         }
                //     },
                //     "MU": {
                //         "value": "1286051",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Mauritius<\/span><br \/><span>Jobs Applied <br\><b> 1286051</b><\/span>"
                //         }
                //     },
                //     "MR": {
                //         "value": "3541540",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Mauritania<\/span><br \/><span>Jobs Applied <br\><b> 3541540</b><\/span>"
                //         }
                //     },
                //     "MX": {
                //         "value": "114793341",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Mexico<\/span><br \/><span>Jobs Applied <br\><b> 114793341</b><\/span>"
                //         }
                //     },
                //     "FM": {
                //         "value": "111542",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Micronesia, Federated States Of<\/span><br \/><span>Jobs Applied <br\><b> 111542</b><\/span>"
                //         }
                //     },
                //     "MD": {
                //         "value": "3559000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Moldova, Republic Of<\/span><br \/><span>Jobs Applied <br\><b> 3559000</b><\/span>"
                //         }
                //     },
                //     "MC": {
                //         "value": "35427",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Monaco<\/span><br \/><span>Jobs Applied <br\><b> 35427</b><\/span>"
                //         }
                //     },
                //     "MN": {
                //         "value": "2800114",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Mongolia<\/span><br \/><span>Jobs Applied <br\><b> 2800114</b><\/span>"
                //         }
                //     },
                //     "ME": {
                //         "value": "632261",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Montenegro<\/span><br \/><span>Jobs Applied <br\><b> 632261</b><\/span>"
                //         }
                //     },
                //     "MZ": {
                //         "value": "23929708",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Mozambique<\/span><br \/><span>Jobs Applied <br\><b> 23929708</b><\/span>"
                //         }
                //     },
                //     "NA": {
                //         "value": "2324004",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Namibia<\/span><br \/><span>Jobs Applied <br\><b> 2324004</b><\/span>"
                //         }
                //     },
                //     "NP": {
                //         "value": "30485798",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Nepal<\/span><br \/><span>Jobs Applied <br\><b> 30485798</b><\/span>"
                //         }
                //     },
                //     "NI": {
                //         "value": "5869859",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Nicaragua<\/span><br \/><span>Jobs Applied <br\><b> 5869859</b><\/span>"
                //         }
                //     },
                //     "NE": {
                //         "value": "16068994",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Niger<\/span><br \/><span>Jobs Applied <br\><b> 16068994</b><\/span>"
                //         }
                //     },
                //     "NG": {
                //         "value": "162470737",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Nigeria<\/span><br \/><span>Jobs Applied <br\><b> 162470737</b><\/span>"
                //         }
                //     },
                //     "NO": {
                //         "value": "4952000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Norway<\/span><br \/><span>Jobs Applied <br\><b> 4952000</b><\/span>"
                //         }
                //     },
                //     "NZ": {
                //         "value": "4405200",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">New Zealand<\/span><br \/><span>Jobs Applied <br\><b> 4405200</b><\/span>"
                //         }
                //     },
                //     "OM": {
                //         "value": "2846145",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Oman<\/span><br \/><span>Jobs Applied <br\><b> 2846145</b><\/span>"
                //         }
                //     },
                //     "UG": {
                //         "value": "34509205",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Uganda<\/span><br \/><span>Jobs Applied <br\><b> 34509205</b><\/span>"
                //         }
                //     },
                //     "UZ": {
                //         "value": "29341200",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Uzbekistan<\/span><br \/><span>Jobs Applied <br\><b> 29341200</b><\/span>"
                //         }
                //     },
                //     "PK": {
                //         "value": "176745364",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Pakistan<\/span><br \/><span>Jobs Applied <br\><b> 176745364</b><\/span>"
                //         }
                //     },
                //     "PS": {
                //         "value": "4019433",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Palestine, State Of<\/span><br \/><span>Jobs Applied <br\><b> 4019433</b><\/span>"
                //         }
                //     },
                //     "PA": {
                //         "value": "3571185",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Panama<\/span><br \/><span>Jobs Applied <br\><b> 3571185</b><\/span>"
                //         }
                //     },
                //     "PG": {
                //         "value": "7013829",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Papua New Guinea<\/span><br \/><span>Jobs Applied <br\><b> 7013829</b><\/span>"
                //         }
                //     },
                //     "PY": {
                //         "value": "6568290",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Paraguay<\/span><br \/><span>Jobs Applied <br\><b> 6568290</b><\/span>"
                //         }
                //     },
                //     "NL": {
                //         "value": "16696000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Netherlands<\/span><br \/><span>Jobs Applied <br\><b> 16696000</b><\/span>"
                //         }
                //     },
                //     "PE": {
                //         "value": "29399817",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Peru<\/span><br \/><span>Jobs Applied <br\><b> 29399817</b><\/span>"
                //         }
                //     },
                //     "PH": {
                //         "value": "94852030",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Philippines<\/span><br \/><span>Jobs Applied <br\><b> 94852030</b><\/span>"
                //         }
                //     },
                //     "PL": {
                //         "value": "38216000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Poland<\/span><br \/><span>Jobs Applied <br\><b> 38216000</b><\/span>"
                //         }
                //     },
                //     "PT": {
                //         "value": "10637000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Portugal<\/span><br \/><span>Jobs Applied <br\><b> 10637000</b><\/span>"
                //         }
                //     },
                //     "QA": {
                //         "value": "1870041",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Qatar<\/span><br \/><span>Jobs Applied <br\><b> 1870041</b><\/span>"
                //         }
                //     },
                //     "DO": {
                //         "value": "10056181",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Dominican Republic<\/span><br \/><span>Jobs Applied <br\><b> 10056181</b><\/span>"
                //         }
                //     },
                //     "RO": {
                //         "value": "21390000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Romania<\/span><br \/><span>Jobs Applied <br\><b> 21390000</b><\/span>"
                //         }
                //     },
                //     "GB": {
                //         "value": "62641000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">United Kingdom<\/span><br \/><span>Jobs Applied <br\><b> 62641000</b><\/span>"
                //         }
                //     },
                //     "RU": {
                //         "value": "141930000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Russian Federation<\/span><br \/><span>Jobs Applied <br\><b> 141930000</b><\/span>"
                //         }
                //     },
                //     "RW": {
                //         "value": "10942950",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Rwanda<\/span><br \/><span>Jobs Applied <br\><b> 10942950</b><\/span>"
                //         }
                //     },
                //     "KN": {
                //         "value": "53051",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Saint Kitts And Nevis<\/span><br \/><span>Jobs Applied <br\><b> 53051</b><\/span>"
                //         }
                //     },
                //     "SM": {
                //         "value": "31735",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">San Marino<\/span><br \/><span>Jobs Applied <br\><b> 31735</b><\/span>"
                //         }
                //     },
                //     "VC": {
                //         "value": "109365",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Saint Vincent And The Grenadines<\/span><br \/><span>Jobs Applied <br\><b> 109365</b><\/span>"
                //         }
                //     },
                //     "LC": {
                //         "value": "176000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Saint Lucia<\/span><br \/><span>Jobs Applied <br\><b> 176000</b><\/span>"
                //         }
                //     },
                //     "SV": {
                //         "value": "6227491",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">El Salvador<\/span><br \/><span>Jobs Applied <br\><b> 6227491</b><\/span>"
                //         }
                //     },
                //     "WS": {
                //         "value": "183874",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Samoa<\/span><br \/><span>Jobs Applied <br\><b> 183874</b><\/span>"
                //         }
                //     },
                //     "ST": {
                //         "value": "168526",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Sao Tome And Principe<\/span><br \/><span>Jobs Applied <br\><b> 168526</b><\/span>"
                //         }
                //     },
                //     "SN": {
                //         "value": "12767556",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Senegal<\/span><br \/><span>Jobs Applied <br\><b> 12767556</b><\/span>"
                //         }
                //     },
                //     "RS": {
                //         "value": "7261000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Serbia<\/span><br \/><span>Jobs Applied <br\><b> 7261000</b><\/span>"
                //         }
                //     },
                //     "SC": {
                //         "value": "86000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Seychelles<\/span><br \/><span>Jobs Applied <br\><b> 86000</b><\/span>"
                //         }
                //     },
                //     "SL": {
                //         "value": "5997486",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Sierra Leone<\/span><br \/><span>Jobs Applied <br\><b> 5997486</b><\/span>"
                //         }
                //     },
                //     "SG": {
                //         "value": "5183700",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Singapore<\/span><br \/><span>Jobs Applied <br\><b> 5183700</b><\/span>"
                //         }
                //     },
                //     "SK": {
                //         "value": "5440000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Slovakia<\/span><br \/><span>Jobs Applied <br\><b> 5440000</b><\/span>"
                //         }
                //     },
                //     "SI": {
                //         "value": "2052000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Slovenia<\/span><br \/><span>Jobs Applied <br\><b> 2052000</b><\/span>"
                //         }
                //     },
                //     "SO": {
                //         "value": "9556873",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Somalia<\/span><br \/><span>Jobs Applied <br\><b> 9556873</b><\/span>"
                //         }
                //     },
                //     "SD": {
                //         "value": "34318385",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Sudan<\/span><br \/><span>Jobs Applied <br\><b> 34318385</b><\/span>"
                //         }
                //     },
                //     "SS": {
                //         "value": "10314021",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">South Sudan<\/span><br \/><span>Jobs Applied <br\><b> 10314021</b><\/span>"
                //         }
                //     },
                //     "LK": {
                //         "value": "20869000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Sri Lanka<\/span><br \/><span>Jobs Applied <br\><b> 20869000</b><\/span>"
                //         }
                //     },
                //     "SE": {
                //         "value": "9453000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Sweden<\/span><br \/><span>Jobs Applied <br\><b> 9453000</b><\/span>"
                //         }
                //     },
                //     "CH": {
                //         "value": "7907000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Switzerland<\/span><br \/><span>Jobs Applied <br\><b> 7907000</b><\/span>"
                //         }
                //     },
                //     "SR": {
                //         "value": "529419",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Suriname<\/span><br \/><span>Jobs Applied <br\><b> 529419</b><\/span>"
                //         }
                //     },
                //     "SZ": {
                //         "value": "1067773",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Swaziland<\/span><br \/><span>Jobs Applied <br\><b> 1067773</b><\/span>"
                //         }
                //     },
                //     "SY": {
                //         "value": "20820311",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Syrian Arab Republic<\/span><br \/><span>Jobs Applied <br\><b> 20820311</b><\/span>"
                //         }
                //     },
                //     "TJ": {
                //         "value": "6976958",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Tajikistan<\/span><br \/><span>Jobs Applied <br\><b> 6976958</b><\/span>"
                //         }
                //     },
                //     "TZ": {
                //         "value": "46218486",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Tanzania, United Republic Of<\/span><br \/><span>Jobs Applied <br\><b> 46218486</b><\/span>"
                //         }
                //     },
                //     "TD": {
                //         "value": "11525496",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Chad<\/span><br \/><span>Jobs Applied <br\><b> 11525496</b><\/span>"
                //         }
                //     },
                //     "CZ": {
                //         "value": "10546000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Czech Republic<\/span><br \/><span>Jobs Applied <br\><b> 10546000</b><\/span>"
                //         }
                //     },
                //     "TH": {
                //         "value": "69518555",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Thailand<\/span><br \/><span>Jobs Applied <br\><b> 69518555</b><\/span>"
                //         }
                //     },
                //     "TL": {
                //         "value": "1175880",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Timor-leste<\/span><br \/><span>Jobs Applied <br\><b> 1175880</b><\/span>"
                //         }
                //     },
                //     "TG": {
                //         "value": "6154813",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Togo<\/span><br \/><span>Jobs Applied <br\><b> 6154813</b><\/span>"
                //         }
                //     },
                //     "TO": {
                //         "value": "104509",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Tonga<\/span><br \/><span>Jobs Applied <br\><b> 104509</b><\/span>"
                //         }
                //     },
                //     "TT": {
                //         "value": "1346350",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Trinidad And Tobago<\/span><br \/><span>Jobs Applied <br\><b> 1346350</b><\/span>"
                //         }
                //     },
                //     "TN": {
                //         "value": "10673800",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Tunisia<\/span><br \/><span>Jobs Applied <br\><b> 10673800</b><\/span>"
                //         }
                //     },
                //     "TM": {
                //         "value": "5105301",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Turkmenistan<\/span><br \/><span>Jobs Applied <br\><b> 5105301</b><\/span>"
                //         }
                //     },
                //     "TR": {
                //         "value": "73639596",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Turkey<\/span><br \/><span>Jobs Applied <br\><b> 73639596</b><\/span>"
                //         }
                //     },
                //     "TV": {
                //         "value": "9847",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Tuvalu<\/span><br \/><span>Jobs Applied <br\><b> 9847</b><\/span>"
                //         }
                //     },
                //     "VU": {
                //         "value": "245619",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Vanuatu<\/span><br \/><span>Jobs Applied <br\><b> 245619</b><\/span>"
                //         }
                //     },
                //     "VE": {
                //         "value": "29278000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Venezuela, Bolivarian Republic Of<\/span><br \/><span>Jobs Applied <br\><b> 29278000</b><\/span>"
                //         }
                //     },
                //     "VN": {
                //         "value": "87840000",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Viet Nam<\/span><br \/><span>Jobs Applied <br\><b> 87840000</b><\/span>"
                //         }
                //     },
                //     "UA": {
                //         "value": "45706100",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Ukraine<\/span><br \/><span>Jobs Applied <br\><b> 45706100</b><\/span>"
                //         }
                //     },
                //     "UY": {
                //         "value": "3368595",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Uruguay<\/span><br \/><span>Jobs Applied <br\><b> 3368595</b><\/span>"
                //         }
                //     },
                //     "YE": {
                //         "value": "24799880",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Yemen<\/span><br \/><span>Jobs Applied <br\><b> 24799880</b><\/span>"
                //         }
                //     },
                //     "ZM": {
                //         "value": "13474959",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Zambia<\/span><br \/><span>Jobs Applied <br\><b> 13474959</b><\/span>"
                //         }
                //     },
                //     "ZW": {
                //         "value": "12754378",
                //         "href": "#",
                //         "tooltip": {
                //             "content": "<span class=\"map-tool-hdng\">Zimbabwe<\/span><br \/><span>Jobs Applied <br\><b> 12754378</b><\/span>"
                //         }
                //     }
                // }
            });

            var all_hidden = 'show',
                areas_hidden = 'show',
                plots_hidden = 'show';

            $('#button-all').on('click', function () {
                all_hidden = (all_hidden == 'show') ? 'hide' : 'show';

                $(".mapcontainer").trigger('update', [{
                        setLegendElemsState: all_hidden,
                        animDuration: 1000
                    }]);
            });
            $('#button-areas').on('click', function () {
                areas_hidden = (areas_hidden == 'show') ? 'hide' : 'show';

                $(".mapcontainer").trigger('update', [{
                        setLegendElemsState: {"areaLegend": areas_hidden},
                        animDuration: 1000
                    }]);
            });
            $('#button-plots').on('click', function () {
                plots_hidden = (plots_hidden == 'show') ? 'hide' : 'show';

                $(".mapcontainer").trigger('update', [{
                        setLegendElemsState: {"plotLegend": plots_hidden},
                        animDuration: 1000
                    }]);
            });
        });
