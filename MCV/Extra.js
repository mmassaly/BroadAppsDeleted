class GlobalsForcedFolding 
{
		primaryObject;
		baseInit;
		base_init_exiting;
		gettingData;
		
		constructor()
		{
			this.primaryObject = undefined;
			this.baseInit = false;
			this.base_init_exiting = false;
			this.gettingData = false;
		}
		
		setPrimaryObject(value)
		{
			this.primaryObject = value;
		}
		
		getPrimaryObject()
		{
			return this.primaryObject;
		}
		
		setBaseInit(value)
		{
			this.baseInit = value;
		}
		
		getBaseInit()
		{
			return this.baseInit;
		}
		
		setBaseInitExiting(value)
		{
			this.base_init_exiting = value;
		}
		
		getBaseInitExiting()
		{
			return this.base_init_exiting;
		}
		
		setGettingData(value)
		{
			this.gettingData = value;
		}
		
		getGettingData()
		{
			return this.gettingData;
		}	
}
	
module.exports = {GlobalsForcedFolding};