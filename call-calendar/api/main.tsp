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

model CreateMeetingTypeInput is OmitProperties<MeetingType, "id">;

model MeetingTypeCreated {
  @statusCode statusCode: 201;
  @body meetingType: MeetingType;
}

@error
model MeetingTypeValidationError {
  @statusCode statusCode: 400;
  @body error: {
    message: string;
    fieldErrors: {
      name?: string;
      description?: string;
      durationMinutes?: string;
    };
  };
}

@error
model MeetingTypeNameConflict {
  @statusCode statusCode: 409;
  @body error: {
    message: string;
    fieldErrors: {
      name: string;
    };
  };
}

@post
@route("/api/meeting-types")
@operationId("createMeetingType")
op createMeetingType(@body input: CreateMeetingTypeInput):
  MeetingTypeCreated | MeetingTypeValidationError | MeetingTypeNameConflict;
