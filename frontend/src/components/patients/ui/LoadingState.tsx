const LoadingState = () => (
  <tr>
    <td colSpan={5} className="py-8">
      <div className="flex justify-center items-center">
        <div
          data-testid="loading-spinner"
          className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"
        ></div>
      </div>
    </td>
  </tr>
);

export default LoadingState;
