class SessionHandlerClass 
{
		#sessionCount;
		#lastSession;
		#session;
		#sessionDic;
		#working;
		constructor(session)
		{
			this.session      = (session == undefined)					    ?                      [] : session;
			this.lastSession  = (session != undefined && session.length > 0)? session[session.length-1] : undefined;
			this.sessionCount = (session != undefined && session.length > 0)? session.length          : 0;
			this.sessionDic = {};
			this.working = false;
		}
		
		CreateSession(name,date,participants,pass)
		{
			while(this.working);
			
			var tmp = name;
			var count = 1;
			
			if(this.sessionDic[date.toLocaleDateString('fr-FR')])
			{
				while( this.sessionDic[date.toLocaleDateString('fr-FR')].find( el=> el.sessionName == tmp ) != undefined  )
				{
					tmp = name + count++;
				}	
			}
			else
			{
				this.sessionDic[date.toLocaleDateString('fr-FR')] = [];
			}
			
			const sc = {sessionName:tmp,sessionNumber:this.sessionDic[date.toLocaleDateString('fr-FR')].length,sessionDate:date,sessionParticipants:{},sessionPassword:pass,sessionParticipantsCount: participants};
			this.lastSession = sc;
			this.sessionDic[date.toLocaleDateString('fr-FR')].push(sc);
			this.working = false;
			console.log(sc);
				
			return sc;
		}
		
		AddParticipant(ID,meta,sessionName,date,sessionPass)
		{
			const v = this.GetSession(date,sessionName,sessionPass);
				
			if( v )
			{
				while(v.adding);
				v.adding = true;
				if(!v.sessionParticipants[ID])
				{
					let p = {ID:ID,meta:meta};
					v.sessionParticipants[ID] = {ID:ID,meta:meta,startDate:new Date(Date.now())};
					v.adding = false;
					return v.sessionParticipants[ID];
				}
				else
				{
					let count = 1;
					let IDtmp = ID+count;
					while(v.sessionParticipants[IDtmp])
					{
						++count;IDtmp = ID+count;
					};
					let p = {ID:IDtmp,meta:meta,startDate:new Date(Date.now())};
					v.sessionParticipants[IDtmp] = p;
					v.adding = false;
					return p;
				}
				v.adding = false;
			}
			else
			{
				return undefined;
			}
			
			return undefined;
		}
		
		GetParticipant(ID,sessionName,date,sessionPass)
		{
			const v = this.GetSession(date,sessionName,sessionPass);
			if( !v )
				return undefined;
			return v.sessionParticipants[ID];
		}
		
		GetSession(date,sessionName,sessionPass)
		{
			if(!this.sessionDic[date.toLocaleDateString('fr-FR')])
				return undefined;
			return this.sessionDic[date.toLocaleDateString('fr-FR')].find( ss=> ss.sessionName == sessionName && ss.sessionPassword == sessionPass);
		}
		
		GetLastSession()
		{
			return this.lastSession;
		}
		
		AddOffer(ID,PeerID,sessionName,date,sessionPass,offer)
		{
			return this.AddRoomValue(ID,PeerID,sessionName,date,sessionPass,"offers",offer);
		}
		
		AddMessage(ID,PeerID,sessionName,date,sessionPass,message)
		{
			return this.AddRoomValue(ID,PeerID,sessionName,date,sessionPass,"messages",message);
		}
		
		AddRoomValue(ID,PeerID,sessionName,date,sessionPass,room,roomCurrencyValue)
		{
			const s = this.GetSession(date,sessionName,sessionPass);
			const v = this.GetParticipant(PeerID,sessionName ,date,sessionPass);
			const v2 =  this.GetParticipant(ID,sessionName ,date,sessionPass);
			console.log("Inside add "+room+"Room value");
			
			if( !v || !v2)
				return false;
			
			v.meta[room] = v.meta[room]?v.meta[room] :[];
			const value = {ID:ID, participantStartDate:v2.startDate};
			value[room.endsWith('s')?room.slice(0,room.length-1):room] = roomCurrencyValue;
			let found = v.meta[room].find( f=> JSON.stringify(f) == JSON.stringify(value));
			
			if( !found ) 
			{
				v.meta[room].push(value);
				console.log(room+" added................");
				return true;
			}
			
			console.log(room+" exists .......notxxxxxxxxxxxxxxadded");
			
			return true;
		}
		
		PeerCheckOffers(ID,sessionName,date,sessionPass)
		{
			var room = "offers"; 
			return this.PeerCheckRoomForUpdate(ID,sessionName,date,sessionPass,room);
		}
		
		PeerCheckMessages(ID,sessionName,date,sessionPass)
		{
			var room = "messages"; 
			return this.PeerCheckRoomForUpdate(ID,sessionName,date,sessionPass,room);
		}
		
		PeerCheckParticipantForUpdate(ID,sessionName,date,sessionPass)
		{
			const s = this.GetSession(date,sessionName,sessionPass);
			const returns = {participants:{}};
			if( !s )
				return returns;
			
			Object.values(s.sessionParticipants).forEach( p =>
			{
				if(p.ID != ID)
				{
					returns.participants[p.ID] = p;
				}
			});
			return returns;
		}
		
		PeerCheckRoomForUpdate(ID,sessionName,date,sessionPass,room)
		{
			//const s = this.GetSession(date,sessionName,sessionPass);
			const v = this.GetParticipant(ID,sessionName,date,sessionPass);
			var roomReturns = room+"returns";
			var returns = {};
			var empty = true;
			console.log(" Inside PeerCheck"+room+"ForUpdate ");
			if( !v )
			{
				returns[roomReturns] = [];
				return returns;
			}
			if( !v.meta[room] )
			{
				v.meta[room] = [];
			}
			
			returns[roomReturns] = v.meta[room];		
			
			if( returns[roomReturns].length > 0 )
			{
				console.log("PeerCheck"+room+"ForUpdate has some news..............");
				return returns;
			}
			
			console.log("PeerCheck"+room+"ForUpdate has no newsxxxxxxxxxxxxxxxx");
			return returns;
		}
		
		getSessionToday(date)
		{
			const v = this.sessionDic[date.toLocaleDateString('fr-FR')];
			return v?v:[];
		}
}

module.exports = {SessionHandlerClass};