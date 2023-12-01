						let fields = {Jour:undefined,Début:new Date('11-29-2023') ,Fin:new Date('12-6-2023'),raison:"maladie",IDEmployee:"1-24",Year:2023};
						let day ;
						let startDay ;
						let endDay ;
						let reason ;
						let IDEmployee ;
						let Year;
						let skip_authentification = true;
						let dealingWithArray = false;
						let querySQL = "";
						if(dealingWithArray)
						{
							day = fields["Jour"][0];
							startDay = fields["Début"][0];
							endDay = fields["Fin"][0];
							reason = fields["raison"][0];
							IDEmployee = fields["IDEmployee"][0];
							Year = fields["Year"][0];
						}
						else
						{
							day = fields["Jour"];
							startDay = fields["Début"];
							endDay = fields["Fin"];
							reason = fields["raison"];
							IDEmployee = fields["IDEmployee"];
							Year = fields["Year"];
						}
						
						let tempResult = true;
						let type = fields.raison;
						if(tempResult)
						{
							tablename = "\"2023 état de l'individu\"";
							let values = "";
											
									if(day != undefined)
									{
										values = (reason == "mission")?",true,false,false,false)":(reason == "congès")?",false,true,false,false)":(reason == "maladie")?",false,false,true,false)":false;
										let updateArray = (reason == "mission")?[true,false,false,false]:(reason == "congès")?[false,true,false,false]:(reason == "maladie")?[false,false,true,false]:[false,false,false,false];
										if(values != false && current.getDay() != 6 && current.getDay() != 0 || type == "mission")
										{
											let queryvalues = "('"+IDEmployee+"','"+((day.getMonth()+1)+"-"+day.getDate()+"-"+day.getFullYear())+"'"+values;
											querySQL = "insert into "+tablename+" values "+queryvalues+" ON CONFLICT (IdIndividu,Date) DO Update Set absence ="+updateArray[0]+",maladie = "+updateArray[1]+",mission="+updateArray[2]+",congès="+updateArray[3]+";"; 
										}
										console.log(querySQL);
									}
									if(startDay != undefined && endDay != undefined)
									{
										let current = startDay;
										values = (reason == "mission")?",true,false,false,false)":(reason == "congès")?",false,true,false,false)":(reason == "maladie")?",false,false,true,false)":false;
										
										while(values != false && current <= endDay  )
										{
											let updateArray = (reason == "mission")?[true,false,false,false]:(reason == "congès")?[false,true,false,false]:(reason == "maladie")?[false,false,true,false]:[false,false,false,false];
												
											if(current.getDay() != 6 && current.getDay() != 0 || type == "mission")
											{
												if(values != false)
												{
													let queryvalues = "('"+IDEmployee+"','"+((startDay.getMonth()+1)+"-"+startDay.getDate()+"-"+startDay.getFullYear())+"'"+values;
													querySQL += "insert into "+tablename+" values "+queryvalues+" ON CONFLICT (IdIndividu,Date) DO Update Set absence ="+updateArray[0]+",maladie = "+updateArray[1]+",mission="+updateArray[2]+",congès="+updateArray[3]+";\n"; 
												}
											}
											
											if(current.getDate() == (new Date(current.getYear(),current.getMonth(),0)).getDate())
											{
												if(current.getMonth() == 11)
												{
													current = new Date(current.getFullYear()+1,0,1);
												}
												else
												{
													current = new Date(current.getFullYear(),(current.getMonth()+1),1);
												}
												console.log("new current--------");
												console.log(current);
											}
											else
											{
												current = new Date(current.getFullYear(),(current.getMonth()),current.getDate()+1);
												console.log(current);
											}
										}
										console.log(querySQL);
									}
						}
						