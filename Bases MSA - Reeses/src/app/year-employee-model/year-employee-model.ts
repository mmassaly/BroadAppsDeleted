
export interface Wrapper 
{
	selected_name: number;
	
}

export interface BasicCommands
{
	command: string; 
	cmdArg: string;
	comeBack?:boolean;
	Box?: any;
	Pos?: any;
	userAuthentification: UserData;
}

export interface UserData 
{
	ID:string; 
	Prenom:string; 
	Nom: string;
	genre: string;
	pass:string;
	superadmin:boolean;
	user:boolean;
}


export interface LoginResponse
{
	first: boolean;
	second: any;
	third:boolean;
	comeBack?:boolean;
	Box?: any;
	Pos?: any;
	element:UserData;
}

export interface CommandsSinglePath
{
	path:string;
	index: number;
}

export interface CommandsPathsBundle
{
	paths: CommandsSinglePath[];
	commandObj: CommandsAction
}

export interface CommandsAction
{
	command: string;
	path: string;
	value: string;
}


export interface Base
{
	individuals: any;
	tables: any;
}