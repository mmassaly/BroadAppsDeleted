class SessionHandlerClass 
{
		#sessionCount;
		#lastSession;
		#session;
		
		constructor(session)
		{
			this.session      = (session == undefined)					    ?                      [] : session;
			this.lastSession  = (session != undefined && session.length > 0)? session[session.length] : undefined;
			this.sessionCount = (session != undefined && session.length > 0)? session.length          : 0;
		}
		
		CreateSession(name)
		{
			this.lastSession = name + ++this.sessionCount;
			this.session.push(this.lastSession);
			return {sessionName:this.lastSession,sessionNumber:this.sessionCount};
		}
		
		GetSession(number)
		{
			return this.session[number-1];
		}
		
		GetLastSession()
		{
			return this.lastSession;
		}
}

module.exports = {SessionHandlerClass};