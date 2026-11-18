import "@typespec/http";
import "@typespec/openapi";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@service(#{ title: "Календарь звонков" })
namespace CallCalendar;

model MeetingType {
  id: string;
  @minLength(1) name: string;
  @minLength(1) description: string;
  @minValue(1) @maxValue(480) durationMinutes: int32;
}

@get
@route("/api/meeting-types")
@operationId("listMeetingTypes")
op listMeetingTypes(): MeetingType[];
