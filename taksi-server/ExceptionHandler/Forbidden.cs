namespace taksi_server.ExceptionHandler
{
	public class Forbidden : Exception
	{
		public Forbidden()
		{
		}

		public Forbidden(string message) : base(message)
		{
		}

		public Forbidden(string message, Exception innerException) : base(message, innerException)
		{
		}
	}
}
