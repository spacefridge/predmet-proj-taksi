namespace taksi_server.ExceptionHandler
{
	public class ResourceMissing : Exception
	{
		public ResourceMissing()
		{
		}

		public ResourceMissing(string message) : base(message)
		{
		}

		public ResourceMissing(string message, Exception innerException) : base(message, innerException)
		{
		}
	}
}
